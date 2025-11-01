import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig } from "wagmi";
import { http, defineChain } from "viem";
import { injected } from "wagmi/connectors";

const MONAD_RPC_URL = "https://testnet-rpc.monad.xyz/";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL] },
    public: { http: [MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});

const transports = {
  [monadTestnet.id]: http(MONAD_RPC_URL),
};

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = projectId
  ? getDefaultConfig({
      appName: "Rocket Candle",
      projectId,
      chains: [monadTestnet],
      transports,
      ssr: true,
    })
  : createConfig({
      chains: [monadTestnet],
      connectors: [injected()],
      transports,
      ssr: true,
    });

export const rainbowChains = wagmiConfig.chains ?? [monadTestnet];
export const isWalletConnectProjectIdMissing = !projectId;

