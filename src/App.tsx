import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Staking from "./pages/Staking";
import Artists from "./pages/Artists";
import Patents from "./pages/Patents";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

// --- 1. Import RainbowKit, wagmi, and CSS ---
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { storyAeneid } from 'wagmi/chains'; // Add any chains you need

const queryClient = new QueryClient();
const { connectors } = getDefaultWallets({
  appName: 'Medici',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
});

const wagmiConfig = createConfig({
  chains: [storyAeneid],
  transports: {
    [storyAeneid.id]: http(),
  },
  connectors,
});

const App = () => (
    <QueryClientProvider client={queryClient}>
  <WagmiProvider config={wagmiConfig}>
    <RainbowKitProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/patents" element={<Patents />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/history" element={<History />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
    </RainbowKitProvider>
  </WagmiProvider>
    </QueryClientProvider>
);

export default App;
