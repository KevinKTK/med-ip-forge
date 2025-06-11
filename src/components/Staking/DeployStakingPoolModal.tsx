import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from 'wagmi';
import { useStakingPoolDeployer } from '@/utils/contractUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeployStakingPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploySuccess: () => void;
}

export const DeployStakingPoolModal = ({ isOpen, onClose, onDeploySuccess }: DeployStakingPoolModalProps) => {
  const [formData, setFormData] = useState({
    projectId: '',
    apy: '',
    poolName: '',
    lockupPeriods: '',
    totalPoolSize: '',
  });
  const [projects, setProjects] = useState<{ id: number; title: string; artist_id: number; }[]>([]);
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { deployContract, isDeploying, error: deployError } = useStakingPoolDeployer();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, artist_id');
      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects.",
          variant: "destructive",
        });
      } else {
        setProjects(data || []);
      }
    };
    fetchProjects();
  }, [toast]);

  useEffect(() => {
    if (deployError) {
      toast({
        title: "Deployment Error",
        description: deployError,
        variant: "destructive",
      });
    }
  }, [deployError, toast]);

  const validateForm = () => {
    if (!formData.projectId) {
      toast({
        title: "Validation Error",
        description: "Please select a project",
        variant: "destructive",
      });
      return false;
    }

    const apy = parseFloat(formData.apy);
    if (isNaN(apy) || apy <= 0 || apy > 100) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid APY between 0 and 100",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.poolName.trim()) {
      toast({
        title: "Validation Error",
        description: "Pool name is required",
        variant: "destructive",
      });
      return false;
    }

    let parsedLockupPeriods: number[];
    try {
      parsedLockupPeriods = formData.lockupPeriods.split(',').map(s => parseInt(s.trim(), 10));
      if (parsedLockupPeriods.some(isNaN) || parsedLockupPeriods.length === 0) {
        throw new Error("Invalid lockup periods");
      }
    } catch (e) {
      toast({
        title: "Validation Error",
        description: "Please enter valid, comma-separated lockup periods (e.g., 30,90,180)",
        variant: "destructive",
      });
      return false;
    }

    const totalPoolSize = parseFloat(formData.totalPoolSize);
    if (isNaN(totalPoolSize) || totalPoolSize <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid total pool size",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy a staking pool",
        variant: "destructive",
      });
      return;
    }

    try {
      await deployContract({
        projectId: parseInt(formData.projectId, 10),
        contractType: 'staking',
        apy: parseFloat(formData.apy),
        poolName: formData.poolName.trim(),
        lockupPeriods: formData.lockupPeriods.split(',').map(s => parseInt(s.trim(), 10)),
        totalPoolSize: parseFloat(formData.totalPoolSize),
      });
      toast({
        title: "Staking Pool Deployed",
        description: "Your staking pool has been successfully deployed and registered!",
        variant: "default",
      });
      onDeploySuccess();
      onClose();
      setFormData({
        projectId: '',
        apy: '',
        poolName: '',
        lockupPeriods: '',
        totalPoolSize: '',
      });
    } catch (err) {
      // Error handling is done by useContractDeployer and displayed via toast
      console.error("Staking pool deployment failed:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Deploy New Staking Pool</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new smart contract for a staking pool and register it in Supabase.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="projectId">Select Project</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="poolName">Pool Name</Label>
            <Input
              id="poolName"
              value={formData.poolName}
              onChange={(e) => setFormData({ ...formData, poolName: e.target.value })}
              placeholder="e.g., My Awesome Staking Pool"
              required
            />
          </div>

          <div>
            <Label htmlFor="apy">APY (%)</Label>
            <Input
              id="apy"
              type="number"
              value={formData.apy}
              onChange={(e) => setFormData({ ...formData, apy: e.target.value })}
              placeholder="e.g., 5.0 (for 5% APY)"
              step="0.1"
              required
            />
          </div>

          <div>
            <Label htmlFor="lockupPeriods">Lockup Periods (days, comma-separated)</Label>
            <Input
              id="lockupPeriods"
              value={formData.lockupPeriods}
              onChange={(e) => setFormData({ ...formData, lockupPeriods: e.target.value })}
              placeholder="e.g., 30,90,180"
              required
            />
          </div>

          <div>
            <Label htmlFor="totalPoolSize">Total Pool Size (IP)</Label>
            <Input
              id="totalPoolSize"
              type="number"
              value={formData.totalPoolSize}
              onChange={(e) => setFormData({ ...formData, totalPoolSize: e.target.value })}
              placeholder="e.g., 1000000 (total IP capacity)"
              step="0.01"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-neon-gradient hover:opacity-90"
            disabled={isDeploying}
          >
            {isDeploying ? 'Deploying Staking Pool...' : 'Deploy Staking Pool'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 