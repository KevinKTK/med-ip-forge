
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, ExternalLink, Filter } from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'Stake',
    asset: 'MediTech Patents',
    amount: '$5,000',
    date: '2024-01-15',
    status: 'Confirmed',
    txHash: '0x1234...abcd'
  },
  {
    id: 2,
    type: 'Reward',
    asset: 'AI Copyright Pool',
    amount: '$485.20',
    date: '2024-01-14',
    status: 'Confirmed',
    txHash: '0x5678...efgh'
  },
  {
    id: 3,
    type: 'Unstake',
    asset: 'Green Energy Pool',
    amount: '$2,500',
    date: '2024-01-13',
    status: 'Pending',
    txHash: '0x9012...ijkl'
  },
  {
    id: 4,
    type: 'Stake',
    asset: 'Entertainment IP',
    amount: '$3,200',
    date: '2024-01-12',
    status: 'Confirmed',
    txHash: '0x3456...mnop'
  }
];

export const TransactionHistory = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stake': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'unstake': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      case 'reward': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <History className="w-5 h-5 mr-2" />
            Recent Transactions
          </CardTitle>
          <Button variant="outline" size="sm" className="neon-border">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-3 bg-background/30 rounded-lg border border-white/5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(tx.type)}>{tx.type}</Badge>
                <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
              </div>
              <p className="text-white font-medium">{tx.amount}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-white">{tx.asset}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{tx.date}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-neon-blue hover:bg-neon-blue/10"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {tx.txHash}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full neon-border text-sm">
          View All Transactions
        </Button>
      </CardContent>
    </Card>
  );
};
