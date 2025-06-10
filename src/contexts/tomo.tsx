
"use client";
import '@tomo-inc/tomo-evm-kit/styles.css';
import { getDefaultConfig, TomoEVMKitProvider } from "@tomo-inc/tomo-evm-kit";
import { aeneid } from "@story-protocol/core-sdk";
import { supabase } from "@/utils/supabase";

// Function to get Tomo configuration from Supabase secrets
const getTomoConfig = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-tomo-config');
    
    if (error) throw error;
    
    return getDefaultConfig({
      appName: "Test Story App",
      clientId: data.tomoClientId,
      projectId: data.walletConnectProjectId,
      chains: [aeneid],
      ssr: false,
    });
  } catch (error) {
    console.error('Failed to get Tomo config from Supabase secrets:', error);
    // Fallback configuration without secrets
    return getDefaultConfig({
      appName: "Test Story App",
      clientId: "", // Will need to be configured
      projectId: "", // Will need to be configured
      chains: [aeneid],
      ssr: false,
    });
  }
};

// Export a function that returns the config after fetching secrets
export const getWagmiConfig = getTomoConfig;
