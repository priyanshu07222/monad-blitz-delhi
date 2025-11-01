import { useState, useCallback } from "react";

export const useGameLaunch = (walletAddress, isReadyForGame) => {
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameError, setGameError] = useState(null);

  const startGame = useCallback(async () => {
    if (!isReadyForGame) {
      setGameError(
        "Please connect your wallet and switch to Monad Testnet first"
      );
      return;
    }

    try {
      setGameError(null);
      setIsGameRunning(true);

      // Initialize Phaser game (we'll import this from the original game files)
      const { initializeGame } = await import("../utils/gameInitializer.js");
      await initializeGame(walletAddress);

      //console.log("🚀 Game started successfully");
    } catch (error) {
      console.error("Failed to start game:", error);
      setGameError(error.message || "Failed to start game");
      setIsGameRunning(false);
    }
  }, [walletAddress, isReadyForGame]);

  const stopGame = useCallback(() => {
    setIsGameRunning(false);
    setGameError(null);
    // Additional cleanup could go here
  }, []);

  return {
    isGameRunning,
    gameError,
    startGame,
    stopGame,
  };
};
