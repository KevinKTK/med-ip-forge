
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyProjects } from '@/hooks/useMyProjects';
import { ProjectEditModal } from './ProjectEditModal';
import { MyProjectCard } from './MyProjectCard';
import { Filter, Plus } from 'lucide-react';

interface MyProjectsViewProps {
  onCreateProject: () => void;
}

export const MyProjectsView = ({ onCreateProject }: MyProjectsViewProps) => {
  const { projects, isLoading, updateProject, deleteProject } = useMyProjects();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any>(null);

  const filteredProjects = projects.filter(project => 
    statusFilter ? project.project_status === statusFilter : true
  );

  const statusCounts = {
    draft: projects.filter(p => p.project_status === 'draft').length,
    published: projects.filter(p => p.project_status === 'published').length,
    funded: projects.filter(p => p.project_status === 'funded').length,
    completed: projects.filter(p => p.project_status === 'completed').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-neon-blue" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first project to start showcasing your ideas and raising funds.
          </p>
          <Button
            onClick={onCreateProject}
            className="bg-neon-gradient hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Bar */}
      <div className="pixel-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
            className="pixel-button"
          >
            All Projects ({projects.length})
          </Button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="pixel-button"
              disabled={count === 0}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <MyProjectCard
            key={project.id}
            project={project}
            onEdit={() => setEditingProject(project)}
            onDelete={() => deleteProject(project.id)}
            onUpdateStatus={(status) => updateProject(project.id, { project_status: status })}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <ProjectEditModal
          isOpen={true}
          onClose={() => setEditingProject(null)}
          project={editingProject}
          onUpdate={(updates) => {
            updateProject(editingProject.id, updates);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};
