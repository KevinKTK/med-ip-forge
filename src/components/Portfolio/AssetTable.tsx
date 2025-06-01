
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, Plus, Minus } from 'lucide-react';

const portfolioAssets = [
  {
    id: 1,
    name: 'Marvel Cinematic Universe',
    type: 'Copyright',
    stakedAmount: 25000,
    currentValue: 28750,
    shares: 0.15,
    performance: 15.0,
    apy: 12.5,
  },
  {
    id: 2,
    name: 'Tesla Autopilot Patents',
    type: 'Patent',
    stakedAmount: 15000,
    currentValue: 16200,
    shares: 0.08,
    performance: 8.0,
    apy: 18.2,
  },
  {
    id: 3,
    name: 'Spotify Music Catalog',
    type: 'Copyright',
    stakedAmount: 12000,
    currentValue: 13320,
    shares: 0.05,
    performance: 11.0,
    apy: 9.8,
  },
  {
    id: 4,
    name: 'Apple iPhone Design',
    type: 'Patent',
    stakedAmount: 20000,
    currentValue: 22400,
    shares: 0.12,
    performance: 12.0,
    apy: 15.7,
  },
  {
    id: 5,
    name: 'Netflix Original Content',
    type: 'Copyright',
    stakedAmount: 8000,
    currentValue: 8560,
    shares: 0.03,
    performance: 7.0,
    apy: 11.3,
  },
];

export const AssetTable = () => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Your Assets</CardTitle>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search assets..."
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Asset</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Staked Amount</TableHead>
              <TableHead className="text-gray-300">Current Value</TableHead>
              <TableHead className="text-gray-300">Shares</TableHead>
              <TableHead className="text-gray-300">Performance</TableHead>
              <TableHead className="text-gray-300">APY</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioAssets.map((asset) => (
              <TableRow key={asset.id} className="border-gray-700 hover:bg-gray-800/50">
                <TableCell className="text-white font-medium">
                  {asset.name}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={asset.type === 'Copyright' ? 'border-neon-blue text-neon-blue' : 'border-neon-purple text-neon-purple'}
                  >
                    {asset.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  ${asset.stakedAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-white font-medium">
                  ${asset.currentValue.toLocaleString()}
                </TableCell>
                <TableCell className="text-gray-300">
                  {(asset.shares * 100).toFixed(2)}%
                </TableCell>
                <TableCell>
                  <div className={`flex items-center space-x-1 ${asset.performance >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                    {asset.performance >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{asset.performance >= 0 ? '+' : ''}{asset.performance.toFixed(1)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-neon-green">
                  {asset.apy.toFixed(1)}%
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="neon-border">
                      <Plus className="w-3 h-3 mr-1" />
                      Stake
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                      <Minus className="w-3 h-3 mr-1" />
                      Unstake
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
