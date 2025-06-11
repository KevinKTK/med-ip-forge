import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { storyTestnet } from 'wagmi/chains';
import { supabase } from "@/integrations/supabase/client";

// Function to get API keys from Supabase
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

// Function to get RainbowKit configuration from Supabase secrets
const getRainbowKitConfig = async () => {
  try {
    const apiKeys = await getApiKeys();

    if (!apiKeys) {
      throw new Error('Failed to fetch API keys from Supabase.');
    }

    const { connectors } = getDefaultWallets({
      appName: 'Medici',
      projectId: apiKeys.VITE_WALLETCONNECT_PROJECT_ID,
    });

    return createConfig({
      chains: [storyTestnet],
      transports: {
        [storyTestnet.id]: http(),
      },
      connectors,
    });
  } catch (error) {
    console.error('Failed to get WalletConnect config from Supabase secrets:', error);
    // Fallback configuration
    const { connectors } = getDefaultWallets({
      appName: 'Medici',
      projectId: 'fallback-project-id', // This should be replaced with actual config
    });

    return createConfig({
      chains: [storyTestnet],
      transports: {
        [storyTestnet.id]: http(),
      },
      connectors,
    });
  }
};

// Export a function that returns the config after fetching secrets
export const getWagmiConfig = getRainbowKitConfig;

// For backward compatibility, export a default config
const { connectors } = getDefaultWallets({
  appName: 'Medici',
  projectId: 'temp-fallback-id',
});

export const wagmiConfig = createConfig({
  chains: [storyTestnet],
  transports: {
    [storyTestnet.id]: http(),
  },
  connectors,
});
