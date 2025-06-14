import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { PatentsHeader } from '@/components/Patents/PatentsHeader';
import { ProjectFilters } from '@/components/Patents/ProjectFilters';
import { ProjectCard } from '@/components/Patents/ProjectCard';
import { ProjectLeaderboard } from '@/components/Patents/ProjectLeaderboard';
import { WalletSelector } from '@/components/Patents/WalletSelector';
import { StakingHistory } from '@/components/Patents/StakingHistory';
import { VotingModal } from '@/components/Patents/VotingModal';
import { RegisterPatentModal } from '@/components/Patents/RegisterPatentModal';
import { PatentCard } from '@/components/Patents/PatentCard';

const Patents = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isCreatePatentModalOpen, setIsCreatePatentModalOpen] = useState(false);
  
  // Filter states for projects
  const [projectFilterStatus, setProjectFilterStatus] = useState<string | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');

  const mockProjects = [
    {
      id: 1,
      name: 'Quantum Art Generator',
      ticker: '$QART',
      marketCap: '$2.4M',
      completion: 78,
      compoundPercentage: 65,
      controlPercentage: 35,
      status: 'ADVANCING',
      category: 'AI & Art',
      votes: 12450,
      description: 'Revolutionary quantum-powered generative art platform'
    },
    {
      id: 2,
      name: 'Neural Music Composer',
      ticker: '$NMUS',
      marketCap: '$1.8M',
      completion: 45,
      compoundPercentage: 55,
      controlPercentage: 45,
      status: 'LIVE',
      category: 'Music Tech',
      votes: 8920,
      description: 'AI-driven music composition and licensing platform'
    },
    {
      id: 3,
      name: 'Bio-Digital Sculptures',
      ticker: '$BIOS',
      marketCap: '$890K',
      completion: 23,
      compoundPercentage: 40,
      controlPercentage: 60,
      status: 'LAUNCHING',
      category: 'Digital Art',
      votes: 3450,
      description: 'Living digital art forms that evolve based on environmental data'
    }
  ];

  // Filtered projects based on status and search query
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      const matchesStatus = projectFilterStatus ? project.status === projectFilterStatus : true;
      const matchesSearch = project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                            project.description.toLowerCase().includes(projectSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [mockProjects, projectFilterStatus, projectSearchQuery]);

  const mockPatents = [
    {
      title: "AI-Powered Gene Editing System",
      status: "Granted",
      patent_number: "US1234567A",
      filing_date: "2022-01-15",
      category: "Biotechnology",
      description: "A novel CRISPR-Cas9 system enhanced with AI for precision gene editing."
    },
    {
      title: "Decentralized Identity Verification",
      status: "Pending",
      patent_number: "US9876543B",
      filing_date: "2023-03-20",
      category: "Blockchain",
      description: "A blockchain-based system for secure and private identity verification."
    },
    {
      title: "Quantum Cryptography Algorithm",
      status: "Filed",
      patent_number: "US4567890C",
      filing_date: "2024-06-01",
      category: "Quantum Computing",
      description: "A new algorithm leveraging quantum mechanics for unbreakable encryption."
    }
  ];

  const handleVoteProject = (project) => {
    setSelectedProject(project);
    setIsVotingModalOpen(true);
  };

  const handleRegisterPatent = async (patentData: any) => {
    console.log('Patent registered:', patentData);
    setIsCreatePatentModalOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <PatentsHeader onOpenCreatePatentModal={() => setIsCreatePatentModalOpen(true)} />
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'wallet'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('patents')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'patents'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            My Patents
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <ProjectFilters 
              onSelectStatus={setProjectFilterStatus}
              onSearch={setProjectSearchQuery}
              currentStatus={projectFilterStatus}
              currentSearchQuery={projectSearchQuery}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onVote={() => handleVoteProject(project)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && <ProjectLeaderboard projects={mockProjects} />}
        {activeTab === 'wallet' && <WalletSelector />}
        {activeTab === 'history' && <StakingHistory />}
        {activeTab === 'patents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPatents.map((patent, index) => (
              <PatentCard key={index} {...patent} />
            ))}
          </div>
        )}

        <VotingModal
          isOpen={isVotingModalOpen}
          onClose={() => setIsVotingModalOpen(false)}
          project={selectedProject}
        />
        
        <RegisterPatentModal
          isOpen={isCreatePatentModalOpen}
          onClose={() => setIsCreatePatentModalOpen(false)}
          onSubmit={handleRegisterPatent}
        />

      </div>
    </Layout>
  );
};

export default Patents;
