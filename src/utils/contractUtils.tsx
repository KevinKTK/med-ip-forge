
import Staking from '@/contracts/Staking.json';
import Funding from '@/contracts/Funding.json';
import {useState} from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { ContractFunctionExecutionError} from 'viem';
import { supabase } from '@/integrations/supabase/client';
import { storyAeneid } from 'wagmi/chains';
import { parseEther } from 'viem';

export class StakingError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StakingError';
  }
}

export function useStakingPoolDeployer() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface DeployParams {
    projectId: number;
    contractType: 'funding' | 'staking';
    maxFunding?: number; // For Funding contract
    apy?: number; // For Staking contract
    poolName?: string; // For Staking contract
    lockupPeriods?: number[]; // For Staking contract
    totalPoolSize?: number; // For Staking contract
  }

  const deployContract = async (params: DeployParams) => {
    const { projectId, contractType, maxFunding, apy, poolName, lockupPeriods, totalPoolSize } = params;

    if (!walletClient || !walletClient.account) {
      throw new StakingError("Wallet not connected", "WALLET_NOT_CONNECTED");
    }

    setIsDeploying(true);
    setError(null);

    try {
      // Fetch project details to get the project name and artist_id, and target_funding
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('title, artist_id, target_funding')
        .eq('id', projectId)
        .single();

      if (projectError) {
        throw new StakingError(`Failed to fetch project details: ${projectError.message}`, "PROJECT_FETCH_ERROR");
      }
      if (!projectData) {
        throw new StakingError("Project not found", "PROJECT_NOT_FOUND");
      }

      const projectName = projectData.title;

      // Fetch artist details to get the artist name
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('name')
        .eq('id', projectData.artist_id)
        .single();

      if (artistError) {
        throw new StakingError(`Failed to fetch artist details: ${artistError.message}`, "ARTIST_FETCH_ERROR");
      }
      if (!artistData) {
        throw new StakingError("Artist not found", "ARTIST_NOT_FOUND");
      }

      const artistName = artistData.name;

      let contractAbi: any;
      let contractBytecode: `0x${string}`;
      let contractArgs: any[];
      let tableName: 'funding_contracts' | 'staking_pools';
      let insertData: any;
      let projectUpdateColumn: 'funding_contract_id' | 'staking_pool_id';

      if (contractType === 'funding') {
        if (maxFunding === undefined) {
          throw new StakingError("maxFunding is required for funding contracts", "INVALID_ARGS");
        }
        contractAbi = Funding.abi as any;
        contractBytecode = Funding.bytecode.object as `0x${string}`;
        contractArgs = [parseEther(maxFunding.toString())];
        tableName = 'funding_contracts';
        insertData = {
          project_id: projectId,
          contract_address: '',
          deployer_address: walletClient.account.address,
          deployment_date: new Date().toISOString(),
          max_funding: maxFunding,
        };
        projectUpdateColumn = 'funding_contract_id';
      } else if (contractType === 'staking') {
        if (apy === undefined || poolName === undefined || lockupPeriods === undefined || totalPoolSize === undefined) {
          throw new StakingError("apy, poolName, lockupPeriods, and totalPoolSize are required for staking contracts", "INVALID_ARGS");
        }
        // Validate inputs for staking contract
        if (apy <= 0 || apy > 100) {
          throw new StakingError("Invalid APY value", "INVALID_APY");
        }

        if (!lockupPeriods.length) {
          throw new StakingError("Lockup periods are required", "INVALID_LOCKUP_PERIODS");
        }

        contractAbi = Staking.abi as any;
        contractBytecode = Staking.bytecode.object as `0x${string}`;
        contractArgs = [apy, poolName, BigInt(totalPoolSize)];
        tableName = 'staking_pools';
        insertData = {
          project_id: projectId,
          contract_address: '',
          deployer_address: walletClient.account.address,
          deployment_date: new Date().toISOString(),
          apy,
          lockup_periods: lockupPeriods,
          total_staked: 0,
          total_stakers: 0,
          is_active: true,
          name: poolName,
          description: `Staking pool for ${projectName} by ${artistName}`,
          risk_level: 'Medium',
          asset_type: 'IP',
          current_completion: 0,
          total_pool_size: totalPoolSize,
          available_capacity: totalPoolSize,
        };
        projectUpdateColumn = 'staking_pool_id';
      } else {
        throw new StakingError("Invalid contract type specified", "INVALID_CONTRACT_TYPE");
      }

      // Check if project already has a deployed contract of this type
      const { data: existingContract } = await supabase
        .from(tableName)
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (existingContract) {
        throw new StakingError(`Project already has a deployed ${contractType} contract`, "CONTRACT_EXISTS");
      }

      // Deploy the contract
      const hash = await walletClient.deployContract({
        abi: contractAbi,
        bytecode: contractBytecode,
        args: contractArgs,
        chain: storyAeneid,
      });

      // Wait for the transaction to be confirmed
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });

      if (!receipt.contractAddress) {
        throw new StakingError("Deployment failed: contract address not found", "DEPLOYMENT_FAILED");
      }

      // Update insertData with the deployed contract address
      insertData.contract_address = receipt.contractAddress;

      // Store the deployed contract information in Supabase
      const { data: newContractRecord, error: dbError } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()
        .single();

      if (dbError) {
        throw new StakingError(`Database error: ${dbError.message}`, "DB_ERROR");
      }

      // Update the project with the new contract ID
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({ [projectUpdateColumn]: newContractRecord.id })
        .eq('id', projectId);

      if (projectUpdateError) {
        throw new StakingError(`Database error updating project: ${projectUpdateError.message}`, "PROJECT_UPDATE_ERROR");
      }

      return newContractRecord;

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

  return {
    deployContract,
    isDeploying,
    error,
  };
}
