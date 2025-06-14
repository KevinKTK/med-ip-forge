import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from 'wagmi';
import { useStakingPoolDeployer } from '@/utils/contractUtils';
import { ImageUpload } from './ImageUpload';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: any) => Promise<void>;
}

export const CreateProjectModal = ({ isOpen, onClose, onSubmit }: CreateProjectModalProps) => {
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
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const { deployContract, isDeploying, error: deployError } = useStakingPoolDeployer();

  const [artistOption, setArtistOption] = useState<'new' | 'existing'>('new');
  const [newArtistName, setNewArtistName] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState<number | undefined>(undefined);
  const [existingArtists, setExistingArtists] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('id, name');
      if (error) {
        console.error('Error fetching artists:', error);
        toast({
          title: "Error",
          description: "Failed to load existing artists.",
          variant: "destructive",
        });
      } else {
        setExistingArtists(data || []);
        if (data && data.length > 0 && selectedArtistId === undefined) {
          setSelectedArtistId(data[0].id);
        }
      }
    };
    fetchArtists();
  }, [toast, selectedArtistId]);

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

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a project",
        variant: "destructive",
      });
      return;
    }

    if (artistOption === 'new' && !newArtistName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a new artist name",
        variant: "destructive",
      });
      return;
    }

    if (artistOption === 'existing' && selectedArtistId === undefined) {
      toast({
        title: "Validation Error",
        description: "Please select an existing artist",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      let artistId: number;

      if (artistOption === 'new') {
        const { data: newArtist, error: createError } = await supabase
          .from('artists')
          .insert({
            name: newArtistName.trim(),
            genre: 'General',
            verified: false,
            bio: 'New artist on the platform',
          })
          .select('id')
          .single();

        if (createError) throw createError;
        artistId = newArtist.id;
      } else {
        artistId = selectedArtistId!;
      }

      const projectToInsert = {
        title: formData.title.trim(),
        artist_id: artistId,
        category: formData.category,
        target_funding: parseFloat(formData.targetFunding),
        description: formData.description.trim(),
        detailed_description: formData.detailedDescription.trim() || null,
        risk_level: formData.riskLevel,
        time_remaining: '30 days',
        milestones: 3,
        current_funding: 0,
        completed_milestones: 0,
        staking_apy: 0,
        images: formData.images,
        project_status: formData.projectStatus,
        owner_wallet_address: address,
      };

      console.log('Project data being inserted:', projectToInsert);

      const { data: newProject, error: projectInsertError } = await supabase
        .from('projects')
        .insert(projectToInsert)
        .select('id')
        .single();

      if (projectInsertError) throw projectInsertError;
      if (!newProject) throw new Error("Failed to create project in database.");

      const projectId = newProject.id;

      if (formData.projectStatus === 'published') {
        const deployedContract = await deployContract({
          projectId: projectId,
          contractType: 'funding',
          maxFunding: parseFloat(formData.targetFunding),
        });

        await onSubmit({
          ...newProject,
          funding_contract_id: deployedContract.id,
        });
      } else {
        await onSubmit(newProject);
      }

      // Reset form
      setFormData({
        title: '',
        category: '',
        targetFunding: '',
        description: '',
        detailedDescription: '',
        riskLevel: 'Medium',
        images: [],
        projectStatus: 'draft',
      });

      onClose();

    } catch (error) {
      console.error('Project creation error:', error);

      let errorMessage = "Failed to create project";

      if (error instanceof Error) {
        if (error.message.includes("artist")) {
          errorMessage = "Could not associate project with artist profile";
        } else if (error.message.includes("wallet")) {
          errorMessage = "Wallet connection required";
        } else if (error.message.includes("database")) {
          errorMessage = "Could not save project to database";
        } else if (error.message.includes("contract")) {
          errorMessage = "Project saved, but failed to deploy funding contract";
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
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="artist-option">Artist</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={artistOption === 'new' ? 'secondary' : 'ghost'}
                  onClick={() => setArtistOption('new')}
                >
                  New Artist
                </Button>
                <Button
                  type="button"
                  variant={artistOption === 'existing' ? 'secondary' : 'ghost'}
                  onClick={() => setArtistOption('existing')}
                >
                  Existing Artist
                </Button>
              </div>
              {artistOption === 'new' ? (
                <Input
                  id="new-artist-name"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  placeholder="Enter new artist name"
                  className="mt-2"
                />
              ) : (
                <Select
                  value={selectedArtistId !== undefined ? selectedArtistId.toString() : ''}
                  onValueChange={(value) => setSelectedArtistId(parseInt(value, 10))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an existing artist" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingArtists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id.toString()}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="published">Publish Project</SelectItem>
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
                disabled={isCreating || isDeploying}
              >
                {isCreating || isDeploying ? 'Creating Project...' : 
                 formData.projectStatus === 'published' ? 'Create & Publish' : 'Save Draft'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
