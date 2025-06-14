
import { useState, useEffect } from 'react';
import { StoryClient } from '@story-protocol/core-sdk';
import { useAccount } from 'wagmi';
import { getStoryClient } from '@/contexts/StoryKit';

export const useStoryClient = () => {
  const [storyClient, setStoryClient] = useState<StoryClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const initializeClient = async () => {
      if (!isConnected || !address) {
        setStoryClient(null);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const client = await getStoryClient(address);
        setStoryClient(client);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Story client');
        console.error('Error initializing Story client:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeClient();
  }, [address, isConnected]);

  return {
    storyClient,
    isLoading,
    error,
  };
};
