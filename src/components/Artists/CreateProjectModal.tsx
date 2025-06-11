
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from 'wagmi';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: any) => Promise<void>;
  isDeploying: boolean;
}

export const CreateProjectModal = ({ isOpen, onClose, onSubmit, isDeploying }: CreateProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    targetFunding: '',
    stakingApy: '',
    description: '',
    riskLevel: 'Medium',
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { isConnected } = useAccount();

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.category) {
      toast({
        title: "Validation Error", 
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }

    const targetFunding = parseFloat(formData.targetFunding);
    if (isNaN(targetFunding) || targetFunding <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid target funding amount",
        variant: "destructive",
      });
      return false;
    }

    const stakingApy = parseFloat(formData.stakingApy);
    if (isNaN(stakingApy) || stakingApy <= 0 || stakingApy > 100) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid APY between 0 and 100",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Project description is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getCurrentUserArtist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Try to find existing artist for this user
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('name', user.email) // Using email as a fallback identifier
        .single();

      if (artistError && artistError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw artistError;
      }

      if (artist) {
        return artist.id;
      }

      // Create a new artist profile if none exists
      const { data: newArtist, error: createError } = await supabase
        .from('artists')
        .insert({
          name: user.email?.split('@')[0] || 'Unknown Artist',
          genre: 'General',
          verified: false,
          bio: 'New artist on the platform',
        })
        .select('id')
        .single();

      if (createError) {
        throw createError;
      }

      return newArtist.id;
    } catch (error) {
      console.error('Error getting/creating artist:', error);
      throw new Error("Could not associate project with artist profile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a staking pool",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Step 1: Get or create artist profile
      const artistId = await getCurrentUserArtist();

      // Step 2: Map form data to database schema (snake_case)
      const projectData = {
        title: formData.title.trim(),
        artist_id: artistId,
        category: formData.category,
        target_funding: parseFloat(formData.targetFunding),
        staking_apy: parseFloat(formData.stakingApy),
        description: formData.description.trim(),
        risk_level: formData.riskLevel,
        time_remaining: '30 days', // Default value
        milestones: 3, // Default value
      };

      // Step 3: Call the parent onSubmit function
      await onSubmit(projectData);
      
      // Reset form on success
      setFormData({
        title: '',
        category: '',
        targetFunding: '',
        stakingApy: '',
        description: '',
        riskLevel: 'Medium',
      });
      
      onClose();
      
    } catch (error) {
      console.error('Project creation error:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = "Failed to create project";
      
      if (error instanceof Error) {
        if (error.message.includes("artist")) {
          errorMessage = "Could not associate project with artist profile";
        } else if (error.message.includes("wallet")) {
          errorMessage = "Wallet connection required for staking pool creation";
        } else if (error.message.includes("database")) {
          errorMessage = "Could not save project to database";
        } else if (error.message.includes("contract")) {
          errorMessage = "Project saved, but failed to deploy staking contract";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error Creating Project",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digital Art">Digital Art</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Film">Film</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="targetFunding">Target Funding (USD)</Label>
              <Input
                id="targetFunding"
                type="number"
                value={formData.targetFunding}
                onChange={(e) => setFormData({ ...formData, targetFunding: e.target.value })}
                placeholder="Enter target funding amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="stakingApy">Staking APY (%)</Label>
              <Input
                id="stakingApy"
                type="number"
                value={formData.stakingApy}
                onChange={(e) => setFormData({ ...formData, stakingApy: e.target.value })}
                placeholder="Enter staking APY"
                min="0.1"
                max="100"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select
                value={formData.riskLevel}
                onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Project Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project"
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
                rows={4}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 neon-border"
              disabled={isCreating || isDeploying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isDeploying}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              {isCreating || isDeploying ? 'Creating Project...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
