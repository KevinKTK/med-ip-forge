
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { storyTestnet } from '@story-protocol/core-sdk';
import FundingABI from '@/contracts/Funding.json';
import StakingABI from '@/contracts/Staking.json';

const publicClient = createPublicClient({
  chain: storyTestnet,
  transport: http(),
});

const getFundingBytecode = () => {
  const bytecodeData = FundingABI.bytecode;
  if (typeof bytecodeData === 'string') {
    return bytecodeData.startsWith('0x') ? bytecodeData as `0x${string}` : `0x${bytecodeData}` as `0x${string}`;
  } else if (bytecodeData && typeof bytecodeData.object === 'string') {
    return bytecodeData.object.startsWith('0x') ? bytecodeData.object as `0x${string}` : `0x${bytecodeData.object}` as `0x${string}`;
  }
  throw new Error('Invalid bytecode format for Funding contract');
};

const getStakingBytecode = () => {
  const bytecodeData = StakingABI.bytecode;
  if (typeof bytecodeData === 'string') {
    return bytecodeData.startsWith('0x') ? bytecodeData as `0x${string}` : `0x${bytecodeData}` as `0x${string}`;
  } else if (bytecodeData && typeof bytecodeData.object === 'string') {
    return bytecodeData.object.startsWith('0x') ? bytecodeData.object as `0x${string}` : `0x${bytecodeData.object}` as `0x${string}`;
  }
  throw new Error('Invalid bytecode format for Staking contract');
};

export const deployFundingContract = async (
  walletClient: any,
  maxFunding: bigint,
  account: any
) => {
  try {
    console.log('Deploying funding contract with params:', {
      maxFunding: maxFunding.toString(),
      account: account.address
    });

    const hash = await walletClient.deployContract({
      abi: FundingABI.abi,
      bytecode: getFundingBytecode(),
      args: [maxFunding],
      account: account,
      chain: storyTestnet,
      type: 'eip1559',
    } as any);

    console.log('Funding contract deployment hash:', hash);

    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash,
      confirmations: 1
    });

    console.log('Funding contract deployed at:', receipt.contractAddress);
    return {
      address: receipt.contractAddress,
      transactionHash: hash
    };
  } catch (error) {
    console.error('Error deploying funding contract:', error);
    throw error;
  }
};

export const deployStakingContract = async (
  walletClient: any,
  projectId: bigint,
  stakingToken: `0x${string}`,
  rewardToken: `0x${string}`,
  rewardRate: bigint,
  account: any
) => {
  try {
    console.log('Deploying staking contract with params:', {
      projectId: projectId.toString(),
      stakingToken,
      rewardToken,
      rewardRate: rewardRate.toString(),
      account: account.address
    });

    const hash = await walletClient.deployContract({
      abi: StakingABI.abi,
      bytecode: getStakingBytecode(),
      args: [projectId, stakingToken, rewardToken, rewardRate],
      account: account,
      chain: storyTestnet,
      type: 'eip1559',
    } as any);

    console.log('Staking contract deployment hash:', hash);

    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash,
      confirmations: 1
    });

    console.log('Staking contract deployed at:', receipt.contractAddress);
    return {
      address: receipt.contractAddress,
      transactionHash: hash
    };
  } catch (error) {
    console.error('Error deploying staking contract:', error);
    throw error;
  }
};

export const getFundingContractDetails = async (contractAddress: `0x${string}`) => {
  try {
    const [maxFunding, currentFunding] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: FundingABI.abi,
        functionName: 'maxFunding',
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: FundingABI.abi,
        functionName: 'currentFunding',
      }),
    ]);

    return {
      maxFunding,
      currentFunding,
    };
  } catch (error) {
    console.error('Error reading funding contract:', error);
    throw error;
  }
};

export const getStakingContractDetails = async (contractAddress: `0x${string}`) => {
  try {
    const [totalStaked, rewardRate] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: StakingABI.abi,
        functionName: 'totalStaked',
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: StakingABI.abi,
        functionName: 'rewardRate',
      }),
    ]);

    return {
      totalStaked,
      rewardRate,
    };
  } catch (error) {
    console.error('Error reading staking contract:', error);
    throw error;
  }
};
