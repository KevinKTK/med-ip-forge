
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Calendar,
  Target,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface MyProjectCardProps {
  project: any;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: string) => void;
}

export const MyProjectCard = ({ project, onEdit, onDelete, onUpdateStatus }: MyProjectCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/20 text-gray-400';
      case 'published':
        return 'bg-blue-500/20 text-blue-400';
      case 'funded':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const fundingPercentage = (project.current_funding / project.target_funding) * 100;

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(newStatus);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="glass-card hover:shadow-neon transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(project.project_status)}>
                {project.project_status}
              </Badge>
              <Badge variant="outline" className="neon-border text-xs">
                {project.category}
              </Badge>
            </div>
            <CardTitle className="text-lg text-white mb-1 line-clamp-2">
              {project.title}
            </CardTitle>
            <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/10">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              
              {project.project_status === 'draft' && (
                <DropdownMenuItem onClick={() => handleStatusChange('published')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Publish Project
                </DropdownMenuItem>
              )}
              
              {project.project_status === 'published' && (
                <DropdownMenuItem onClick={() => handleStatusChange('draft')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Move to Draft
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="relative">
              {project.images.length === 1 ? (
                <img
                  src={project.images[0]}
                  alt="Project image"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <Carousel className="w-full">
                  <CarouselContent>
                    {project.images.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {project.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              )}
              <Badge className="absolute top-2 right-2 bg-black/60 text-white">
                <ImageIcon className="w-3 h-3 mr-1" />
                {project.images.length}
              </Badge>
            </div>
          )}

          {/* Funding Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Funding Progress</span>
              <span className="text-white">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={fundingPercentage} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {formatCurrency(project.current_funding)} raised
              </span>
              <span className="text-white">
                {formatCurrency(project.target_funding)} goal
              </span>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neon-blue" />
              <span className="text-gray-400">Created</span>
            </div>
            <div className="text-white">
              {new Date(project.created_at).toLocaleDateString()}
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-neon-green" />
              <span className="text-gray-400">Risk</span>
            </div>
            <div className="text-white">{project.risk_level}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="flex-1 neon-border"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
            {project.project_status === 'draft' && (
              <Button
                size="sm"
                onClick={() => handleStatusChange('published')}
                className="flex-1 bg-neon-blue hover:bg-neon-blue/80"
              >
                Publish
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Project</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
              >
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
