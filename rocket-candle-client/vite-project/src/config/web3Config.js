// Environment Variables
const MONAD_RPC_URL =
  import.meta.env.VITE_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz/";
const MONAD_EXPLORER_URL =
  import.meta.env.VITE_MONAD_EXPLORER_URL ||
  "https://testnet.monadexplorer.com/";
const MONAD_CHAIN_ID = parseInt(import.meta.env.VITE_MONAD_CHAIN_ID) || 10143;

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
  iconUrl: "/monad-icon.png",
  iconBackground: "#000",
};

// Contract Addresses (deployed on Monad Testnet)
export const CONTRACTS = {
  ROCKET_CANDLE:
    import.meta.env.VITE_ROCKET_CANDLE_CONTRACT ||
    "0x7e045E5591Cfd42208a08D0cd89218218cD4c8C5",
  ROCKET_FUEL:
    import.meta.env.VITE_ROCKET_FUEL_CONTRACT ||
    "0xFakeRocketFuelTokenAddress123456789",
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  ENDPOINTS: {
    SUBMIT_SCORE: "/submit-score",
    LEADERBOARD: "/leaderboard",
    PLAYER_SCORES: "/player-scores",
    REWARD_FUEL: "/reward-fuel",
    FUEL_BALANCE: "/fuel-balance",
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Export simplified config for our wallet manager
export const MONAD_TESTNET = {
  chainId: MONAD_CHAIN_ID,
  chainIdHex: `0x${MONAD_CHAIN_ID.toString(16)}`,
  name: "Monad Testnet",
  rpcUrl: MONAD_RPC_URL,
  explorerUrl: MONAD_EXPLORER_URL,
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
};
