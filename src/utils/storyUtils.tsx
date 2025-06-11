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
      if (!storyClient) {
        throw new Error("Story Protocol client not initialized.");
      }

      const tx = await storyClient.license.registerLicense({
        ipId: ipId,
        licensor: licensorAddress,
        licensee: licenseeAddress,
        terms: terms,
      });

      const txHash = tx.hash;

      // Optional: Wait for transaction confirmation
      // const receipt = await tx.wait();

      // Store license data in Supabase
      const { data, error: dbError } = await supabase
        .from('licenses')
        .insert([
          {
            ip_id: ipId,
            licensor_address: licensorAddress,
            licensee_address: licenseeAddress,
            terms: terms,
            transaction_hash: txHash,
          },
        ]);

      if (dbError) {
        console.error("Supabase error:", dbError);
        setError("Failed to save license data.");
        throw new Error("Failed to save license data to Supabase.");
      }

      return { txHash, supabaseData: data };
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
            if (!storyClient) {
                throw new Error("Story Protocol client not initialized.");
            }

            const license = await storyClient.license.getLicense(ipId);
            return license;
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
