import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { getStoryClient } from '@/contexts/StoryKit';
import { StoryClient } from '@story-protocol/core-sdk';

export function useStoryClient() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [storyClient, setStoryClient] = useState<StoryClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      setIsLoading(true);
      setError(null);
      if (isConnected && walletClient && walletClient.account) {
        try {
          const client = await getStoryClient(walletClient.account);
          setStoryClient(client);
        } catch (err) {
          console.error("Error initializing StoryClient:", err);
          setError(err instanceof Error ? err.message : "Failed to initialize Story Protocol client.");
        }
      } else {
        setStoryClient(null);
        setError("Wallet not connected or account not available for Story Protocol.");
      }
      setIsLoading(false);
    };

    initializeClient();
  }, [isConnected, walletClient]);

  return { storyClient, isLoading, error };
} 