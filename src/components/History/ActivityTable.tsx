
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  type: 'stake' | 'trade' | 'claim' | 'reward' | 'vote';
  asset: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  project?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-06-01 14:32',
    type: 'stake',
    asset: 'IP',
    amount: '500.00',
    status: 'completed',
    txHash: '0x1a2b3c...',
    project: 'AI Music Generator'
  },
  {
    id: '2',
    date: '2024-06-01 12:15',
    type: 'reward',
    asset: 'IP',
    amount: '12.50',
    status: 'completed',
    txHash: '0x4d5e6f...',
    project: 'Neural Art Engine'
  },
  {
    id: '3',
    date: '2024-05-31 16:45',
    type: 'trade',
    asset: 'SHARES',
    amount: '100.00',
    status: 'completed',
    txHash: '0x7g8h9i...',
    project: 'Blockchain Patents'
  },
  {
    id: '4',
    date: '2024-05-31 09:22',
    type: 'vote',
    asset: 'IP',
    amount: '25.00',
    status: 'completed',
    txHash: '0xj1k2l3...',
    project: 'DeFi Innovation'
  },
  {
    id: '5',
    date: '2024-05-30 18:30',
    type: 'claim',
    asset: 'IP',
    amount: '75.25',
    status: 'pending',
    txHash: '0xm4n5o6...',
    project: 'Smart Contracts'
  },
];

export const ActivityTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-cyber-purple text-white';
      case 'pending': return 'bg-cyber-yellow text-black';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stake': return 'bg-cyber-purple text-white';
      case 'trade': return 'bg-cyber-pink text-white';
      case 'claim': return 'bg-cyber-cyan text-black';
      case 'reward': return 'bg-cyber-magenta text-white';
      case 'vote': return 'bg-cyber-orange text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="pixel-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-retro text-cyber-purple text-sm uppercase">Activity Log</h3>
        <div className="text-xs text-cyber-purple/70 font-pixel">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, mockTransactions.length)} of {mockTransactions.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-cyber-purple">
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">Date</TableHead>
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">Type</TableHead>
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">Project</TableHead>
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">Asset</TableHead>
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">Amount</TableHead>
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">Status</TableHead>
              <TableHead className="text-cyber-purple font-retro text-xs uppercase">TX Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((tx) => (
              <TableRow key={tx.id} className="border-cyber-purple/30 hover:bg-cyber-purple/5">
                <TableCell className="font-pixel text-xs text-cyber-purple/80">
                  {tx.date}
                </TableCell>
                <TableCell>
                  <Badge className={`${getTypeColor(tx.type)} font-retro text-xs uppercase rounded-none`}>
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-pixel text-xs text-cyber-purple/80">
                  {tx.project || '-'}
                </TableCell>
                <TableCell className="font-pixel text-xs text-cyber-purple font-bold">
                  {tx.asset}
                </TableCell>
                <TableCell className="font-pixel text-xs text-cyber-purple font-bold">
                  {tx.amount}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(tx.status)} font-retro text-xs uppercase rounded-none`}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyber-cyan hover:text-cyber-cyan/80 font-pixel text-xs p-0"
                  >
                    {tx.txHash}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-white font-retro text-xs"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          PREV
        </Button>
        
        <div className="flex space-x-2">
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page 
                ? "pixel-button" 
                : "border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-white font-retro text-xs"
              }
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 3}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-white font-retro text-xs"
        >
          NEXT
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
