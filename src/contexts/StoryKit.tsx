
import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { storyAeneid } from "wagmi/chains";
import { supabase } from "@/utils/supabase";

// Function to get Story Protocol configuration from Supabase secrets
const getStoryConfig = async (): Promise<StoryConfig> => {
  try {
    // Call Supabase edge function to get the configuration with secrets
    const { data, error } = await supabase.functions.invoke('get-story-config');
    
    if (error) throw error;
    
    const privateKey: Address = `0x${data.walletPrivateKey}`;
    const account: Account = privateKeyToAccount(privateKey);

    const config: StoryConfig = {
      account: account,
      transport: http(data.rpcProviderUrl),
      chainId: storyAeneid.id
    };
    
    return config;
  } catch (error) {
    console.error('Failed to get Story config from Supabase secrets:', error);
    throw new Error('Story Protocol configuration failed');
  }
};

// Export a function that returns the client after configuration
export const getStoryClient = async () => {
  const config = await getStoryConfig();
  return StoryClient.newClient(config);
};
