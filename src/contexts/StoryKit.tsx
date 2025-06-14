
import { StoryClient, Account } from '@story-protocol/core-sdk';

const RPC_PROVIDER_URL = 'https://testnet.storyrpc.io';

export const getStoryClient = async (walletAddress: `0x${string}`): Promise<StoryClient> => {
  try {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    // Create a simple account object
    const account: Account = {
      address: walletAddress,
      // Add other required properties if needed
    } as any;

    const client = StoryClient.newClient({
      account: account,
      transport: {
        rpcUrl: RPC_PROVIDER_URL,
      },
      chainId: 'testnet',
    });

    return client;
  } catch (error) {
    console.error('Error creating Story client:', error);
    throw error;
  }
};
