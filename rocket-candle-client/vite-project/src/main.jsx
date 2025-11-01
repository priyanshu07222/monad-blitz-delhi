import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";
import App from "./App.jsx";
import {
  wagmiConfig,
  rainbowChains,
  isWalletConnectProjectIdMissing,
  monadTestnet,
} from "./config/wagmiConfig.js";

const queryClient = new QueryClient();

if (import.meta.env.DEV && isWalletConnectProjectIdMissing) {
  console.warn(
    "RainbowKit WalletConnect project ID is missing. Set VITE_WALLETCONNECT_PROJECT_ID in your .env file to enable WalletConnect."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={rainbowChains}
          initialChain={monadTestnet}
          modalSize="compact"
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
