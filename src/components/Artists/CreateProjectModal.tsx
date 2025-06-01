
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Plus, Upload, Calendar, DollarSign, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundingGoal: '',
    duration: '30',
    milestones: [''],
    royaltyShare: '2.0'
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const categories = ['Digital Art', 'Music', 'Film', 'Fashion', 'Gaming', 'Literature', 'Photography'];

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, '']
    }));
  };

  const updateMilestone = (index: number, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = value;
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const removeMilestone = (index: number) => {
    if (formData.milestones.length > 1) {
      const newMilestones = formData.milestones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, milestones: newMilestones }));
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.fundingGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    setTimeout(() => {
      toast({
        title: "Project Created Successfully!",
        description: `"${formData.title}" has been submitted for review. You'll be notified once it's approved.`,
      });
      setIsCreating(false);
      onClose();
      setFormData({
        title: '',
        description: '',
        category: '',
        fundingGoal: '',
        duration: '30',
        milestones: [''],
        royaltyShare: '2.0'
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Create New Project</DialogTitle>
          <p className="text-gray-400">Launch your creative project and start raising funds</p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Enter your project title"
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Describe your project, its goals, and what makes it unique"
              rows={4}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-blue focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Funding Goal ($) *</label>
              <input
                type="number"
                value={formData.fundingGoal}
                onChange={(e) => updateFormData('fundingGoal', e.target.value)}
                placeholder="50000"
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Campaign Duration (days)</label>
              <select
                value={formData.duration}
                onChange={(e) => updateFormData('duration', e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-blue focus:outline-none"
              >
                <option value="30">30 days</option>
                <option value="45">45 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Revenue Share (%)</label>
              <select
                value={formData.royaltyShare}
                onChange={(e) => updateFormData('royaltyShare', e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-blue focus:outline-none"
              >
                <option value="1.0">1.0% - Conservative</option>
                <option value="2.0">2.0% - Standard</option>
                <option value="3.5">3.5% - Aggressive</option>
                <option value="5.0">5.0% - Premium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Project Milestones</label>
            <div className="space-y-2">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={milestone}
                    onChange={(e) => updateMilestone(index, e.target.value)}
                    placeholder={`Milestone ${index + 1}`}
                    className="flex-1 bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
                  />
                  {formData.milestones.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      className="neon-border"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addMilestone}
                className="neon-border"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>
          </div>

          <div className="p-4 bg-background/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Project Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Funding Goal</p>
                <p className="text-neon-blue font-medium">${formData.fundingGoal || '0'}</p>
              </div>
              <div>
                <p className="text-gray-400">Revenue Share</p>
                <p className="text-neon-blue font-medium">{formData.royaltyShare}%</p>
              </div>
              <div>
                <p className="text-gray-400">Duration</p>
                <p className="text-white">{formData.duration} days</p>
              </div>
              <div>
                <p className="text-gray-400">Milestones</p>
                <p className="text-white">{formData.milestones.filter(m => m.trim()).length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 neon-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              <Target className="w-4 h-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
