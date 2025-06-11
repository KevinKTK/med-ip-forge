
import Staking from '@/contracts/Staking.json';
import {useState} from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { ContractFunctionExecutionError} from 'viem';
import { supabase } from '@/integrations/supabase/client';
import { storyTestnet } from 'wagmi/chains';

export class StakingError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StakingError';
  }
}

interface ProjectStakingPool {
  projectId: number;
  contractAddress: string;
  deployerAddress: string;
  deploymentDate: string;
  apy: number;
  lockupPeriods: number[];
}

export function useStakingPoolDeployer() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deployStakingPool = async (projectId: number, apy: number, lockupPeriods: number[]) => {
    if (!walletClient) {
      throw new StakingError("Wallet not connected", "WALLET_NOT_CONNECTED");
    }

    setIsDeploying(true);
    setError(null);

    try {
      // Validate inputs
      if (apy <= 0 || apy > 100) {
        throw new StakingError("Invalid APY value", "INVALID_APY");
      }

      if (!lockupPeriods.length) {
        throw new StakingError("Lockup periods are required", "INVALID_LOCKUP_PERIODS");
      }

      // Check if project already has a staking pool
      const { data: existingPool } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (existingPool) {
        throw new StakingError("Project already has a staking pool", "POOL_EXISTS");
      }

      const stakingAbi = Staking.abi as any;
      const stakingBytecode = Staking.bytecode.object as `0x${string}`;

      // Deploy the contract with required parameters
      const hash = await walletClient.deployContract({
        abi: stakingAbi,
        bytecode: stakingBytecode,
        args: [apy, `Project ${projectId} Staking Pool`, BigInt(1000000)],
        type: 'eip1559',
        chain: storyTestnet
      });

      // Wait for the transaction to be confirmed
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });

      if (!receipt.contractAddress) {
        throw new StakingError("Deployment failed: contract address not found", "DEPLOYMENT_FAILED");
      }

      // Store the deployed contract information in Supabase with all required fields
      const { data: newPool, error: dbError } = await supabase
        .from('staking_pools')
        .insert({
          project_id: projectId,
          contract_address: receipt.contractAddress,
          deployer_address: walletClient.account.address,
          deployment_date: new Date().toISOString(),
          apy,
          lockup_periods: lockupPeriods,
          total_staked: 0,
          total_stakers: 0,
          is_active: true,
          name: `Project ${projectId} Staking Pool`,
          description: `Staking pool for project ${projectId}`,
          risk_level: 'Medium',
          asset_type: 'IP',
          current_completion: 0,
          total_pool_size: 1000000,
          available_capacity: 1000000,
        })
        .select()
        .single();

      if (dbError) {
        throw new StakingError(`Database error: ${dbError.message}`, "DB_ERROR");
      }

      return newPool;

    } catch (err) {
      if (err instanceof StakingError) {
        setError(err.message);
        throw err;
      } else if (err instanceof ContractFunctionExecutionError) {
        const error = new StakingError(`Contract Error: ${err.shortMessage}`, "CONTRACT_ERROR");
        setError(error.message);
        throw error;
      } else {
        const error = new StakingError(
          err instanceof Error ? err.message : "An unknown error occurred",
          "UNKNOWN_ERROR"
        );
        setError(error.message);
        throw error;
      }
    } finally {
      setIsDeploying(false);
    }
  };

  const getStakingPool = async (projectId: number) => {
    try {
      const { data, error } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        throw new StakingError(`Database error: ${error.message}`, "DB_ERROR");
      }

      return data;
    } catch (err) {
      if (err instanceof StakingError) {
        throw err;
      }
      throw new StakingError(
        err instanceof Error ? err.message : "Failed to fetch staking pool",
        "FETCH_ERROR"
      );
    }
  };

  const updateStakingPool = async (
    projectId: number,
    updates: any
  ) => {
    try {
      const { data, error } = await supabase
        .from('staking_pools')
        .update(updates)
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) {
        throw new StakingError(`Database error: ${error.message}`, "DB_ERROR");
      }

      return data;
    } catch (err) {
      if (err instanceof StakingError) {
        throw err;
      }
      throw new StakingError(
        err instanceof Error ? err.message : "Failed to update staking pool",
        "UPDATE_ERROR"
      );
    }
  };

  return {
    deployStakingPool,
    getStakingPool,
    updateStakingPool,
    isDeploying,
    error,
  };
}
