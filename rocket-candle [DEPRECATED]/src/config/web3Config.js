import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

// Environment Variables
const MONAD_RPC_URL =
  import.meta.env.VITE_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz/";
const MONAD_EXPLORER_URL =
  import.meta.env.VITE_MONAD_EXPLORER_URL ||
  "https://testnet.monadexplorer.com/";
const MONAD_CHAIN_ID = parseInt(import.meta.env.VITE_MONAD_CHAIN_ID) || 10143;
const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
  "your_walletconnect_project_id_here";

// Monad Testnet Chain Configuration
export const monadTestnet = {
  id: MONAD_CHAIN_ID,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: MONAD_EXPLORER_URL,
    },
  },
  iconUrl: "/monad-icon.png", // Add monad icon to public folder
  iconBackground: "#000",
};

// Wagmi Configuration
export const config = getDefaultConfig({
  appName: import.meta.env.VITE_GAME_NAME || "Rocket Candle",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(MONAD_RPC_URL),
  },
  ssr: false, // We're using vanilla JS, not SSR
});

// Contract Addresses (deployed on Monad Testnet)
export const CONTRACTS = {
  ROCKET_CANDLE:
    import.meta.env.VITE_ROCKET_CANDLE_CONTRACT ||
    "0x7e045E5591Cfd42208a08D0cd89218218cD4c8C5",
  ROCKET_FUEL:
    import.meta.env.VITE_ROCKET_FUEL_CONTRACT ||
    "0x7c1EeBF05f80D74B002dC8a8BDD72c44143c798f",
  ROCKET_CANDLE_SCORES:
    import.meta.env.VITE_ROCKET_CANDLE_SCORES_CONTRACT ||
    "0xB6D82716996DA655ab62A1D78859Ac86f318a132",
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  ENDPOINTS: {
    SUBMIT_SCORE: "/submit-score",
    REWARD_FUEL: "/reward-fuel",
    PLAYER_SCORES: "/player-scores",
    LEADERBOARD: "/leaderboard",
    FUEL_BALANCE: "/fuel-balance",
  },
};

// Environment Utilities
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.NODE_ENV === "development",
  isDebugMode: import.meta.env.VITE_DEBUG_MODE === "true",
  gameVersion: import.meta.env.VITE_GAME_VERSION || "1.0.0",
};

// Configuration Validation
export const validateConfig = () => {
  const errors = [];

  if (
    !CONTRACTS.ROCKET_CANDLE ||
    CONTRACTS.ROCKET_CANDLE === "0x7e045E5591Cfd42208a08D0cd89218218cD4c8C5"
  ) {
    console.warn(
      "⚠️ Using default ROCKET_CANDLE contract address. Please set VITE_ROCKET_CANDLE_CONTRACT in .env"
    );
  }

  if (
    !CONTRACTS.ROCKET_FUEL ||
    CONTRACTS.ROCKET_FUEL === "0x7c1EeBF05f80D74B002dC8a8BDD72c44143c798f"
  ) {
    console.warn(
      "⚠️ Using default ROCKET_FUEL contract address. Please set VITE_ROCKET_FUEL_CONTRACT in .env"
    );
  }

  if (
    !CONTRACTS.ROCKET_CANDLE_SCORES ||
    CONTRACTS.ROCKET_CANDLE_SCORES ===
      "0xB6D82716996DA655ab62A1D78859Ac86f318a132"
  ) {
    console.warn(
      "⚠️ Using default ROCKET_CANDLE_SCORES contract address. Please set VITE_ROCKET_CANDLE_SCORES_CONTRACT in .env"
    );
  }

  if (WALLETCONNECT_PROJECT_ID === "your_walletconnect_project_id_here") {
    console.warn(
      "⚠️ Using placeholder WalletConnect Project ID. Please set VITE_WALLETCONNECT_PROJECT_ID in .env"
    );
  }

  if (ENV_CONFIG.isDebugMode) {
    console.log("🔧 Debug mode enabled");
    console.log("📊 Configuration:", {
      chainId: MONAD_CHAIN_ID,
      rpcUrl: MONAD_RPC_URL,
      contracts: CONTRACTS,
      apiBaseUrl: API_CONFIG.BASE_URL,
    });
  }

  return errors;
};

// Auto-validate configuration on import
validateConfig();
