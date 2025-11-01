import { useState, useCallback } from "react";
import { useToast } from "../context/ToastContext";

export const useGameState = () => {
  const [gameActive, setGameActive] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const { showSuccess, showError, showInfo } = useToast();

  const startGame = useCallback(
    async (onStartCallback) => {
      if (gameActive || gameLoading) return;

      setGameLoading(true);
      showInfo("Preparing game...");

      try {
        if (onStartCallback) {
          await onStartCallback();
        }
        setGameActive(true);
        setGameScore(0);
        showSuccess("Game started! Good luck! 🚀");
      } catch (error) {
        console.error("Failed to start game:", error);
        showError(`Failed to start game: ${error.message}`);
      } finally {
        setGameLoading(false);
      }
    },
    [gameActive, gameLoading, showInfo, showSuccess, showError]
  );

  const endGame = useCallback(
    (finalScore = 0, onEndCallback) => {
      if (!gameActive) return;

      setGameActive(false);
      setGameScore(finalScore);

      // Update high score if needed
      if (finalScore > highScore) {
        setHighScore(finalScore);
        showSuccess(`New high score: ${finalScore.toLocaleString()}! 🎉`);
      } else {
        showInfo(`Game over! Final score: ${finalScore.toLocaleString()}`);
      }

      if (onEndCallback) {
        onEndCallback(finalScore);
      }
    },
    [gameActive, highScore, showSuccess, showInfo]
  );

  const pauseGame = useCallback(() => {
    if (gameActive) {
      setGameActive(false);
      showInfo("Game paused");
    }
  }, [gameActive, showInfo]);

  const resumeGame = useCallback(() => {
    if (!gameActive) {
      setGameActive(true);
      showInfo("Game resumed");
    }
  }, [gameActive, showInfo]);

  const resetGame = useCallback(() => {
    setGameActive(false);
    setGameLoading(false);
    setGameScore(0);
    setCurrentLevel(1);
  }, []);

  const updateScore = useCallback((newScore) => {
    setGameScore(newScore);
  }, []);

  const levelUp = useCallback(() => {
    setCurrentLevel((prev) => {
      const newLevel = prev + 1;
      showSuccess(`Level up! Welcome to level ${newLevel}! 🌟`);
      return newLevel;
    });
  }, [showSuccess]);

  return {
    // State
    gameActive,
    gameLoading,
    gameScore,
    highScore,
    currentLevel,

    // Actions
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,
    updateScore,
    levelUp,

    // Computed values
    isGameReady: !gameLoading && !gameActive,
    canStart: !gameActive && !gameLoading,
  };
};
