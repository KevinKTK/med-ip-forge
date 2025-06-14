
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getStoryClient } from '@/contexts/StoryKit';
import { StoryClient } from '@story-protocol/core-sdk';

export const useStoryProtocol = () => {
  const [storyClient, setStoryClient] = useState<StoryClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const initializeStoryProtocol = async () => {
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
        setError(err instanceof Error ? err.message : 'Failed to initialize Story Protocol');
        console.error('Story Protocol initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStoryProtocol();
  }, [address, isConnected]);

  return {
    storyClient,
    isLoading,
    error,
  };
};
