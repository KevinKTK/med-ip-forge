// --- 1. Import RainbowKit, wagmi, and CSS ---
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { storyAeneid } from 'wagmi/chains'; // Add any chains you need


const { connectors } = getDefaultWallets({
    appName: 'Medici',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
});

export const wagmiConfig = createConfig({
    chains: [storyAeneid],
    transports: {
        [storyAeneid.id]: http(),
    },
    connectors,
});
