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

import '@rainbow-me/rainbowkit/styles.css';
import {RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {WagmiProvider } from 'wagmi';
import { wagmiConfig } from './contexts/RainbowKit';

const queryClient = new QueryClient();

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
