"use client";
import '@tomo-inc/tomo-evm-kit/styles.css';
import { getDefaultConfig, TomoEVMKitProvider } from "@tomo-inc/tomo-evm-kit";
import { aeneid } from "@story-protocol/core-sdk";

export const wagmiConfig = getDefaultConfig({
    appName: "Test Story App",
    clientId: import.meta.env.VITE_TOMO_CLIENT_ID as string,
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string,
    chains: [aeneid],
    ssr: false, // If your dApp uses server side rendering (SSR)
});
