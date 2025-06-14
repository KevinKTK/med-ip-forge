
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: number;
  onProjectCreated: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose, artistId, onProjectCreated }: CreateProjectModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_funding: 0,
    risk_level: '',
    time_remaining: '',
    milestones: 1,
    staking_apy: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const projectData = {
        title: formData.title,
        artist_id: artistId,
        category: formData.category,
        target_funding: formData.target_funding,
        description: formData.description,
        risk_level: formData.risk_level,
        time_remaining: formData.time_remaining,
        milestones: formData.milestones,
        current_funding: 0,
        completed_milestones: 0,
        staking_apy: formData.staking_apy,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project created successfully!",
      });

      onProjectCreated();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        target_funding: 0,
        risk_level: '',
        time_remaining: '',
        milestones: 1,
        staking_apy: 0,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="risk_level">Risk Level</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, risk_level: value })}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_funding">Target Funding</Label>
              <Input
                id="target_funding"
                type="number"
                value={formData.target_funding}
                onChange={(e) => setFormData({ ...formData, target_funding: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="staking_apy">Staking APY (%)</Label>
              <Input
                id="staking_apy"
                type="number"
                step="0.1"
                value={formData.staking_apy}
                onChange={(e) => setFormData({ ...formData, staking_apy: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="milestones">Number of Milestones</Label>
              <Input
                id="milestones"
                type="number"
                min="1"
                value={formData.milestones}
                onChange={(e) => setFormData({ ...formData, milestones: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="time_remaining">Time Remaining</Label>
              <Input
                id="time_remaining"
                placeholder="e.g., 30 days"
                value={formData.time_remaining}
                onChange={(e) => setFormData({ ...formData, time_remaining: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
