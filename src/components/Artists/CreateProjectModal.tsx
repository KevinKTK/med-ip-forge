import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      id: Date.now(), // Temporary ID generation
      ...formData,
      targetFunding: parseFloat(formData.targetFunding),
      stakingApy: parseFloat(formData.stakingApy),
      currentFunding: 0,
      timeRemaining: '30 days',
      milestones: 3,
      completedMilestones: 0,
    };

    await onSubmit(projectData);
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isDeploying}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              {isDeploying ? 'Creating Project...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
