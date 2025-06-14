
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onUpdate: (updates: any) => void;
}

export const ProjectEditModal = ({ isOpen, onClose, project, onUpdate }: ProjectEditModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    targetFunding: '',
    description: '',
    detailedDescription: '',
    riskLevel: 'Medium',
    images: [] as string[],
    projectStatus: 'draft',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        category: project.category || '',
        targetFunding: project.target_funding?.toString() || '',
        description: project.description || '',
        detailedDescription: project.detailed_description || '',
        riskLevel: project.risk_level || 'Medium',
        images: project.images || [],
        projectStatus: project.project_status || 'draft',
      });
    }
  }, [project]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);

    try {
      const updates = {
        title: formData.title.trim(),
        category: formData.category,
        target_funding: parseFloat(formData.targetFunding),
        description: formData.description.trim(),
        detailed_description: formData.detailedDescription.trim() || null,
        risk_level: formData.riskLevel,
        images: formData.images,
        project_status: formData.projectStatus,
      };

      await onUpdate(updates);
      onClose();
    } catch (error) {
      console.error('Project update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Edit Project</DialogTitle>
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
                placeholder="e.g., 10000"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief project description"
                required
              />
            </div>

            <div>
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                placeholder="Detailed project description for marketing..."
                rows={4}
              />
            </div>

            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
            />

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
              <Label htmlFor="projectStatus">Project Status</Label>
              <Select
                value={formData.projectStatus}
                onValueChange={(value) => setFormData({ ...formData, projectStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-neon-gradient hover:opacity-90"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Project'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
