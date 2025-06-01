
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Vote, Coins, X, TrendingUp } from 'lucide-react';

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    name: string;
    ticker: string;
    description: string;
    completion: number;
    votes: number;
  } | null;
}

export const VotingModal = ({ isOpen, onClose, project }: VotingModalProps) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [votingPower, setVotingPower] = useState(0);

  if (!isOpen || !project) return null;

  const handleStakeChange = (value: string) => {
    setStakeAmount(value);
    const amount = parseFloat(value) || 0;
    setVotingPower(amount * 0.1); // 1 $IP = 0.1 voting power
  };

  const handleVote = () => {
    console.log(`Voting for ${project.name} with ${stakeAmount} $IP`);
    // Handle voting logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold gradient-text">Vote on Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-black/30 rounded-lg">
            <h4 className="font-semibold text-white">{project.name}</h4>
            <p className="text-sm text-gray-400">{project.ticker}</p>
            <p className="text-sm text-gray-300 mt-2">{project.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Progress</span>
              <span className="text-neon-blue">{project.completion}%</span>
            </div>
            <Progress value={project.completion} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-black/30 rounded">
              <p className="text-gray-400">Total Votes</p>
              <p className="font-semibold text-white">{project.votes.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <p className="text-gray-400">Your Balance</p>
              <p className="font-semibold text-neon-blue">12,450 $IP</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Stake Amount ($IP)
            </label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => handleStakeChange(e.target.value)}
              placeholder="Enter amount to stake"
              className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
            />
            
            {votingPower > 0 && (
              <div className="p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Voting Power</span>
                  <span className="font-semibold text-neon-blue flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {votingPower.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 neon-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVote}
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              <Vote className="w-4 h-4 mr-2" />
              Cast Vote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
