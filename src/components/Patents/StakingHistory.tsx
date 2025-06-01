
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export const StakingHistory = () => {
  const mockHistory = [
    {
      id: 1,
      project: 'Quantum Art Generator',
      ticker: '$QART',
      amount: '2,500 $IP',
      date: '2024-05-28',
      status: 'Active',
      outcome: 'Pending',
      progress: 78,
      roi: '+24.5%',
      positive: true
    },
    {
      id: 2,
      project: 'Neural Music Composer',
      ticker: '$NMUS',
      amount: '1,800 $IP',
      date: '2024-05-25',
      status: 'Active',
      outcome: 'Pending',
      progress: 45,
      roi: '+12.3%',
      positive: true
    },
    {
      id: 3,
      project: 'Digital Poetry AI',
      ticker: '$POET',
      amount: '3,200 $IP',
      date: '2024-05-15',
      status: 'Completed',
      outcome: 'Funded',
      progress: 100,
      roi: '+45.7%',
      positive: true
    },
    {
      id: 4,
      project: 'VR Sculpture Studio',
      ticker: '$VRSC',
      amount: '1,500 $IP',
      date: '2024-05-10',
      status: 'Completed',
      outcome: 'Rejected',
      progress: 32,
      roi: '-15.2%',
      positive: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Funded': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold gradient-text mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Governance Staking History
        </h3>
        
        <div className="space-y-4">
          {mockHistory.map((stake) => (
            <div key={stake.id} className="p-4 bg-black/30 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-white">{stake.project}</h4>
                  <p className="text-sm text-gray-400">{stake.ticker}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={`${getStatusColor(stake.status)} border`}>
                    {stake.status}
                  </Badge>
                  <Badge className={`${getOutcomeColor(stake.outcome)} border`}>
                    {stake.outcome}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Amount Staked</p>
                  <p className="font-semibold text-white">{stake.amount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="font-semibold text-white flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {stake.date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Progress</p>
                  <p className="font-semibold text-white">{stake.progress}%</p>
                </div>
                <div>
                  <p className="text-gray-400">ROI</p>
                  <p className={`font-semibold flex items-center ${
                    stake.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stake.positive ? 
                      <TrendingUp className="w-3 h-3 mr-1" /> : 
                      <TrendingDown className="w-3 h-3 mr-1" />
                    }
                    {stake.roi}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Funding Progress</span>
                  <span className="text-neon-blue">{stake.progress}%</span>
                </div>
                <Progress value={stake.progress} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
