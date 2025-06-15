import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Star, Coins, FileText, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { StakeProjectModal } from './StakeProjectModal';
import { StakingModal } from '@/components/Staking/StakingModal';
import { supabase } from '@/integrations/supabase/client';
import { useStaking } from '@/hooks/useStaking';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {StakingPoolCard} from "@/components/Staking/StakingPoolCard.tsx";
import { Tables } from '@/integrations/supabase/types';

interface Project {
  id: number;
  title: string;
  description: string;
  current_funding: number;
  target_funding: number;
  completed_milestones: number;
  milestones: number;
  staking_apy: number | null;
  time_remaining: string;
  category: string;
  risk_level: string;
  funding_contract_id?: number | null;
  staking_pool_id?: number | null;
}

interface StakingPool {
  id: number;
  contract_address: string;
  is_active: boolean;
}

type Patent = Tables<'patents'>; // Use Supabase type directly

interface ProjectCardProps {
  project: Project;
  artistName: string;
  patent?: Patent;
}

export const ProjectCard = ({ project, artistName, patent }: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleStake, isStaking } = useStaking(project.id);
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const [fundingContractAddress, setFundingContractAddress] = useState<`0x${string}` | undefined>(undefined);

  useEffect(() => {
    const fetchFundingContractAddress = async () => {
      if (project.funding_contract_id) {
        const { data, error } = await supabase
          .from('funding_contracts')
          .select('contract_address')
          .eq('id', project.funding_contract_id)
          .single();

        if (error) {
          console.error('Error fetching funding contract address:', error);
        } else if (data) {
          setFundingContractAddress(data.contract_address as `0x${string}`);
        }
      }
    };
    fetchFundingContractAddress();
  }, [project.funding_contract_id]);

  const { data: hash, sendTransaction, isPending: isSending, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: contractBalanceData } = useBalance({
    address: fundingContractAddress,
  });

  const contractBalance = contractBalanceData ? parseFloat(contractBalanceData.formatted) : 0;

  const [fundAmount, setFundAmount] = useState('');

  const completionPercentage = (project.completed_milestones / project.milestones) * 100;
  const fundingPercentage = ((project.current_funding + contractBalance) / project.target_funding) * 100;

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatIP = (amount: number) => {
    return "$IP " + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleFundNow = async () => {
    if (!fundingContractAddress) {
      toast({
        title: "Funding Error",
        description: "Funding contract address is missing.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(fundAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Invalid funding amount. Please enter a positive number.",
        variant: "destructive",
      });
      return;
    }

    if (!sendTransaction) {
      toast({
        title: "Wallet Not Ready",
        description: "Wallet is not ready to send transactions. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      sendTransaction({
        to: fundingContractAddress,
        value: parseEther(fundAmount),
      });
    } catch (error: any) {
      toast({
        title: "Transaction Initiation Failed",
        description: error.message || "An unknown error occurred while preparing the transaction.",
        variant: "destructive",
      });
      console.error('Error sending transaction:', error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      // Optionally refresh data or show success toast
      console.log('Transaction confirmed!', hash);
      toast({
        title: "Transaction Confirmed",
        description: `Successfully funded project with ${fundAmount} IP.`, // Corrected message
        variant: "default", // Use 'default' or 'success' if available
      });
      setFundAmount(''); // Clear the input after successful transaction
    }
  }, [isConfirmed, hash, fundAmount, toast]); // Added fundAmount and toast to dependencies

  useEffect(() => {
    if (sendError) {
      toast({
        title: "Transaction Failed",
        description: sendError.message || "An unknown error occurred during transaction.",
        variant: "destructive",
      });
    }
  }, [sendError, toast]);

  return (
    <>
      <Card className="glass-card hover:shadow-neon transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-white mb-1">{project.title}</CardTitle>
              <p className="text-sm text-gray-400">{project.description}</p>
            </div>
            <Badge className={getRiskColor(project.risk_level)}>
              {project.risk_level} Risk
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Funding Progress</span>
                <span className="text-white">{fundingPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={fundingPercentage} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Current Funding</span>
                <span className="text-2xl font-bold text-white">{formatIP(project.current_funding + contractBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Target Funding</span>
                <span className="text-2xl font-bold text-white">{formatIP(project.target_funding)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Project Progress</span>
                  <span className="text-white">{fundingPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={fundingPercentage} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-gray-400">Time Remaining</p>
                <p className="text-white">{project.time_remaining}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Badge variant="outline" className="neon-border">
                {project.category}
              </Badge>
              <span>•</span>
              {patent && (
                <Badge variant="outline" className="neon-border">
                  {patent.title} Patent
                </Badge>
              )}
            </div>

            <div className="flex space-x-2">

            {fundingContractAddress && (
              <Button
                variant="outline"
                className="neon-border"
                onClick={() => window.open(`https://aeneid.storyscan.xyz/address/${fundingContractAddress}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Funding Contract
              </Button>
            )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Fund Amount ($IP)
              </label>
              <Input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="Enter amount to fund"
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              {!isConnected ? (
                <ConnectButton label="Connect Wallet to Fund" />
              ) : (
                <Button
                  onClick={handleFundNow}
                  disabled={isSending || isConfirming || !fundAmount || parseFloat(fundAmount) <= 0 || !fundingContractAddress}
                  className="w-full neon-button"
                >
                  {isSending ? 'Confirming...' : isConfirming ? 'Waiting for confirmation...' : 'Fund Now'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
