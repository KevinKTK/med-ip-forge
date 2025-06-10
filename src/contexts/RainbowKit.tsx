import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { storyAeneid } from 'wagmi/chains';
import { getApiKeys } from "@/utils/supabase";

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
      chains: [storyAeneid],
      transports: {
        [storyAeneid.id]: http(),
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
      chains: [storyAeneid],
      transports: {
        [storyAeneid.id]: http(),
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
  chains: [storyAeneid],
  transports: {
    [storyAeneid.id]: http(),
  },
  connectors,
});
