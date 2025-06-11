
import { useState } from 'react';
import { useStoryClient } from '@/hooks/useStoryClient';
import { supabase } from '@/integrations/supabase/client';

export const useLicenseRegistry = () => {
  const { storyClient } = useStoryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerLicense = async (
    ipId: string,
    licensorAddress: string,
    licenseeAddress: string,
    terms: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("License registration function temporarily disabled.");
      // TODO: Implement license registration when Story Protocol API is available
      return { txHash: "0x123", supabaseData: null };
    } catch (err: any) {
      console.error("Error registering license:", err);
      setError(err.message || "Failed to register license.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { registerLicense, isLoading, error };
};

export const useQueryLicense = () => {
    const { storyClient } = useStoryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryLicense = async (ipId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("License query function temporarily disabled.");
            // TODO: Implement license querying when Story Protocol API is available
            return null;
        } catch (err: any) {
            console.error("Error querying license:", err);
            setError(err.message || "Failed to query license.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { queryLicense, isLoading, error };
};
