import { useState, useEffect, useCallback } from "react";

export const useLeaderboard = (isConnected) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLeaderboard = useCallback(
    async (limit = 10) => {
      if (!isConnected) return;

      setIsLoading(true);
      setError(null);

      try {
        const { web3Service } = await import("../services/Web3Service.js");
        const data = await web3Service.getLeaderboard(limit);
        setLeaderboardData(data || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        setError(err.message || "Failed to load leaderboard");
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected]
  );

  const refreshLeaderboard = useCallback(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (isConnected) {
      loadLeaderboard();
    }
  }, [isConnected, loadLeaderboard]);

  return {
    leaderboardData,
    isLoading,
    error,
    refreshLeaderboard,
  };
};

export const usePlayerStats = (isConnected, address) => {
  const [playerScores, setPlayerScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPlayerStats = useCallback(async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const { web3Service } = await import("../services/Web3Service.js");
      const scores = await web3Service.getPlayerScores(address);
      setPlayerScores(scores || []);
    } catch (err) {
      console.error("Failed to load player stats:", err);
      setError(err.message || "Failed to load player stats");
      setPlayerScores([]);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const refreshPlayerStats = useCallback(() => {
    loadPlayerStats();
  }, [loadPlayerStats]);

  useEffect(() => {
    if (isConnected && address) {
      loadPlayerStats();
    }
  }, [isConnected, address, loadPlayerStats]);

  return {
    playerScores,
    isLoading,
    error,
    refreshPlayerStats,
  };
};

export const useGameOperations = (isConnected, address, refreshBalance) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitScore = useCallback(
    async (level, score) => {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      setIsSubmitting(true);
      try {
        const { web3Service } = await import("../services/Web3Service.js");
        const result = await web3Service.submitScore(level, score);

        // Refresh balance after successful score submission
        if (refreshBalance) {
          await refreshBalance();
        }

        return result;
      } catch (error) {
        console.error("Failed to submit score:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isConnected, address, refreshBalance]
  );

  const rewardRocketFuel = useCallback(
    async (amount) => {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      try {
        const { web3Service } = await import("../services/Web3Service.js");
        const result = await web3Service.rewardFuel(amount);

        // Refresh balance after successful reward
        if (refreshBalance) {
          await refreshBalance();
        }

        return result;
      } catch (error) {
        console.error("Failed to reward RocketFUEL:", error);
        throw error;
      }
    },
    [isConnected, address, refreshBalance]
  );

  const startGame = useCallback(async () => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    try {
      //console.log("🚀 Starting game...");

      // Initialize and start the Phaser game
      const { gameService } = await import("../services/GameService.js");
      gameService.startGame();

      //console.log("✅ Game started successfully");
    } catch (error) {
      console.error("❌ Failed to start game:", error);
      throw error;
    }
  }, [isConnected]);

  return {
    submitScore,
    rewardRocketFuel,
    startGame,
    isSubmitting,
  };
};
