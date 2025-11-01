import { createContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useWallet } from "../hooks/useWallet.js";
import {
  useLeaderboard,
  usePlayerStats,
  useGameOperations,
} from "../hooks/useWeb3Service.js";

// Create context
const WalletContext = createContext(null);

// Provider component
export const WalletProvider = ({ children }) => {
  const wallet = useWallet();
  const {
    address,
    isConnected,
    isCorrectNetwork,
    refreshBalance,
    disconnect,
  } = wallet;

  // Pass wallet state directly to Web3 hooks to avoid circular dependency
  const leaderboard = useLeaderboard(wallet.isConnected);
  const playerStats = usePlayerStats(wallet.isConnected, wallet.address);
  const gameOps = useGameOperations(
    wallet.isConnected,
    wallet.address,
    wallet.refreshBalance
  );

  // Initialize window.walletManager and web3Service early with default values
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize web3Service if not already set
    if (!window.web3Service) {
      import("../services/Web3Service.js").then(({ web3Service }) => {
        window.web3Service = web3Service;
      });
    }

    // Initialize walletManager if not already set
    if (!window.walletManager) {
      window.walletManager = {
        address: null,
        isConnected: false,
        isCorrectNetwork: false,
        currentChainId: null,
        rocketFuelBalance: 0,
        isReadyForGame: function () {
          return this.isConnected && this.isCorrectNetwork;
        },
        refreshBalance: () => {},
        disconnect: () => {},
      };
    }
  }, []);

  // Update window.walletManager properties whenever wallet state changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.walletManager) return;

    // Update properties directly (not getters) for reliable access
    window.walletManager.address = address || null;
    window.walletManager.isConnected = Boolean(isConnected);
    window.walletManager.isCorrectNetwork = Boolean(isCorrectNetwork);
    window.walletManager.currentChainId = wallet.currentChainId || null;
    window.walletManager.rocketFuelBalance = wallet.rocketFuelBalance || 0;
    window.walletManager.refreshBalance = refreshBalance;
    window.walletManager.disconnect = disconnect;

    // Update web3Service with current address
    if (window.web3Service) {
      if (address) {
        window.web3Service.setWallet(address);
      } else {
        window.web3Service.setWallet(null);
      }
    }

    // Debug log in development
    if (import.meta.env.DEV) {
      console.log("🔗 WalletManager updated:", {
        address: window.walletManager.address,
        isConnected: window.walletManager.isConnected,
        isCorrectNetwork: window.walletManager.isCorrectNetwork,
        hasWeb3Service: !!window.web3Service,
      });
    }
  }, [
    address,
    isConnected,
    isCorrectNetwork,
    wallet.currentChainId,
    wallet.rocketFuelBalance,
    refreshBalance,
    disconnect,
  ]);

  const value = {
    ...wallet,
    // Leaderboard
    leaderboardData: leaderboard.leaderboardData,
    leaderboardLoading: leaderboard.isLoading,
    leaderboardError: leaderboard.error,
    refreshLeaderboard: leaderboard.refreshLeaderboard,
    // Player stats
    playerScores: playerStats.playerScores,
    playerStatsLoading: playerStats.isLoading,
    playerStatsError: playerStats.error,
    refreshPlayerStats: playerStats.refreshPlayerStats,
    // Game operations
    submitScore: gameOps.submitScore,
    rewardFuel: gameOps.rewardFuel,
    startGame: gameOps.startGame,
    isSubmitting: gameOps.isSubmitting,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WalletContext;
