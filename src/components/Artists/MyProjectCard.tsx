
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical, Edit, Trash2, Eye, Share2, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tables } from '@/integrations/supabase/types';

type MyProject = Tables<'projects'> & {
  images?: string[];
  project_status?: string;
  marketing_materials?: any;
  owner_wallet_address?: string;
};

interface MyProjectCardProps {
  project: MyProject;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: string) => void;
}

export const MyProjectCard = ({ project, onEdit, onDelete, onUpdateStatus }: MyProjectCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Safely parse images from Json type or fallback to empty array
  const images = Array.isArray(project.images) ? project.images : [];
  const primaryImage = images.length > 0 ? images[0] : null;
  
  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'funded': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string | null | undefined) => {
    return status?.charAt(0).toUpperCase() + (status?.slice(1) || 'draft');
  };

  const fundingProgress = project.target_funding > 0 
    ? (Number(project.current_funding) / Number(project.target_funding)) * 100 
    : 0;

  return (
    <Card className="pixel-card hover:shadow-cyber transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getStatusColor(project.project_status)} text-white`}>
                {getStatusText(project.project_status)}
              </Badge>
              <span className="text-xs text-gray-400">{project.category}</span>
            </div>
            <CardTitle className="text-lg text-white line-clamp-2">{project.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black border-cyber-green">
              <DropdownMenuItem onClick={onEdit} className="text-white hover:bg-cyber-green/20">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-cyber-green/20">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-cyber-green/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:bg-red-500/20">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Image */}
        {primaryImage && !imageError ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
            <img 
              src={primaryImage} 
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Project Description */}
        <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Funding Progress</span>
            <span className="text-white">${Number(project.current_funding).toLocaleString()} / ${Number(project.target_funding).toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-neon-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(fundingProgress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {fundingProgress.toFixed(1)}% funded
          </div>
        </div>

        {/* Milestones */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Milestones</span>
          <span className="text-white">{project.completed_milestones} / {project.milestones}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {project.project_status === 'draft' && (
            <Button 
              size="sm" 
              className="flex-1 bg-neon-blue hover:bg-neon-blue/80"
              onClick={() => onUpdateStatus('published')}
            >
              Publish
            </Button>
          )}
          {project.project_status === 'published' && (
            <Button 
              size="sm" 
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => onUpdateStatus('funded')}
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Fund
            </Button>
          )}
          <Button size="sm" variant="outline" className="flex-1" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
