import { http } from "viem";
import { Account } from "viem/accounts";
import { StoryClient, StoryConfig, SupportedChainIds } from "@story-protocol/core-sdk";
import { storyAeneid } from "wagmi/chains";
import { supabase } from "@/integrations/supabase/client";

const getApiKeys = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-keys');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Failed to get API keys from Supabase:', error);
    return null;
  }
};

// Export a function that returns the client after configuration, accepting the account
export const getStoryClient = async (account: Account) => {
  const { transport, chainId } = await getStoryRpcConfig();
  const config: StoryConfig = {
    account: account,
    transport: transport,
    chainId: chainId
  };
  return StoryClient.newClient(config);
};

// Function to get Story Protocol RPC configuration
const getStoryRpcConfig = async (): Promise<{ transport: StoryConfig['transport'], chainId: SupportedChainIds }> => {
  try {
    const apiKeys = await getApiKeys();

    if (!apiKeys) {
      throw new Error('Failed to fetch API keys from Supabase.');
    }

    return {
      transport: http(apiKeys.RPC_PROVIDER_URL),
      chainId: storyAeneid.id as SupportedChainIds
    };
  } catch (error) {
    console.error('Failed to get Story RPC config from Supabase secrets:', error);
    throw new Error('Story Protocol RPC configuration failed');
  }
};
