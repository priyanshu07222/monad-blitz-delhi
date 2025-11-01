import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../hooks/useWalletContext";
import useGameNotifications from "../hooks/useGameNotifications";
import AppLayout from "../components/layout/AppLayout";
import NetworkIndicator from "../components/ui/NetworkIndicator";
import FloatingBackground from "../components/ui/FloatingBackground";
import GameNotification from "../components/ui/GameNotification";
import LiveLeaderboard from "../components/game/LiveLeaderboard";

const GamePage = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useWalletContext();
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const [gameLoaded, setGameLoaded] = useState(false);

  // Game notifications
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showBlockchainSuccess,
    showBlockchainError,
    showRocketFuelReward,
  } = useGameNotifications();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Set up global notification methods for Phaser scenes
  useEffect(() => {
    window.gameNotifications = {
      showSuccess,
      showError,
      showWarning,
      showBlockchainSuccess,
      showBlockchainError,
      showRocketFuelReward,
    };

    return () => {
      if (window.gameNotifications) {
        delete window.gameNotifications;
      }
    };
  }, [
    showSuccess,
    showError,
    showWarning,
    showBlockchainSuccess,
    showBlockchainError,
    showRocketFuelReward,
  ]);

  // Initialize Phaser game
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const initGame = async () => {
      // Prevent multiple game instances
      if (!gameContainerRef.current || gameInstanceRef.current || !isMounted) {
        return;
      }

      // Clear any existing canvas in the container
      const existingCanvas = gameContainerRef.current.querySelector("canvas");
      if (existingCanvas) {
        existingCanvas.remove();
      }

      try {
        // Dynamic import of Phaser to avoid SSR issues
        const Phaser = (await import("phaser")).default;

        // Import scenes - we'll create these based on the original rocket-candle version
        const { PreloadScene } = await import("../scenes/PreloadScene.js");
        const { MenuScene } = await import("../scenes/MenuScene.js");
        const { GameScene } = await import("../scenes/GameScene.js");
        const { EndGameScene } = await import("../scenes/EndGameScene.js");

        //console.log("Game created");

        const config = {
          type: Phaser.AUTO,
          width: 1200,
          height: 600,
          parent: gameContainerRef.current,
          backgroundColor: "#2c3e50",
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 300 },
              debug: false,
            },
          },
          scene: [PreloadScene, MenuScene, GameScene, EndGameScene],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
        };

        // Only create game if component is still mounted and no game exists
        if (isMounted && !gameInstanceRef.current) {
          gameInstanceRef.current = new Phaser.Game(config);
          setGameLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load game:", error);
      }
    };

    if (isConnected && address && !gameInstanceRef.current) {
      initGame();
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (gameInstanceRef.current) {
        //console.log("Cleaning up Phaser game...");
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
        setGameLoaded(false);
      }
    };
  }, [isConnected, address]); // Simplified dependencies

  if (!isConnected) {
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <AppLayout>
      <NetworkIndicator />
      <FloatingBackground />

      {/* Game Notifications */}
      <GameNotification
        notifications={notifications}
        onRemove={removeNotification}
      />

      <div className="game-page-container">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="back-button"
          style={{ marginBottom: "var(--space-lg)" }}
        >
          ← Back to Dashboard
        </button>

        {/* Game Container */}
        <div className="game-container">
          {!gameLoaded && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading Rocket Candle...</p>
              <p>Preparing your space mission</p>
            </div>
          )}
          <div
            ref={gameContainerRef}
            className={`phaser-game-container ${
              gameLoaded ? "visible" : "hidden"
            }`}
          />
        </div>

        {/* Game Information Section - Below the game */}
        <div className="game-info-section">
          {/* Game Mechanics Panel */}
          <div className="game-mechanics-panel">
            <div className="mechanics-section">
              <h3>🚀 Controls</h3>
              <ul>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/buttons/w.png"
                      alt="W"
                      style={{
                        width: "16px",
                        height: "16px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <img
                      src="/assets/buttons/a.png"
                      alt="A"
                      style={{
                        width: "16px",
                        height: "16px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <img
                      src="/assets/buttons/s.png"
                      alt="S"
                      style={{
                        width: "16px",
                        height: "16px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <img
                      src="/assets/buttons/d.png"
                      alt="D"
                      style={{
                        width: "16px",
                        height: "16px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <span>W/S: Power, A: Right, D: Left</span>
                  </div>
                </li>
                <li>
                  <span>🖱️ Mouse</span> - Aim launcher
                </li>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/buttons/space.png"
                      alt="Space"
                      style={{
                        width: "32px",
                        height: "16px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <span>Launch rocket</span>
                  </div>
                </li>
                <li>
                  <span>📊 Sliders</span> - Fine-tune trajectory
                </li>
              </ul>
            </div>

            <div className="mechanics-section">
              <h3>🎯 Objective</h3>
              <ul>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/enemies/var1.png"
                      alt="Enemy"
                      style={{
                        width: "18px",
                        height: "18px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <img
                      src="/assets/enemies/var2.png"
                      alt="Enemy"
                      style={{
                        width: "18px",
                        height: "18px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <span>Destroy all enemies</span>
                  </div>
                </li>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/blocks/greencandle.png"
                      alt="Green barrier"
                      style={{
                        width: "18px",
                        height: "18px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <img
                      src="/assets/blocks/redcandle.png"
                      alt="Red barrier"
                      style={{
                        width: "18px",
                        height: "18px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <span>Navigate barriers</span>
                  </div>
                </li>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/rocket.png"
                      alt="Rocket"
                      style={{
                        width: "18px",
                        height: "18px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <span>Complete all 7 levels</span>
                  </div>
                </li>
                <li>📊 Beat market volatility!</li>
              </ul>
            </div>

            <div className="mechanics-section">
              <h3>🪙 RocketFUEL Rewards</h3>
              <ul>
                <li>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/rocket.png"
                      alt="RocketFUEL"
                      style={{
                        width: "16px",
                        height: "16px",
                        imageRendering: "pixelated",
                      }}
                    />
                    <span>Earn tokens for destroying enemies</span>
                  </div>
                </li>
                <li>⚡ Bonus for level completion</li>
                <li>🎯 Extra rewards for efficiency</li>
                <li>🏆 Big bonus for game completion</li>
              </ul>
            </div>

            <div className="mechanics-section">
              <h3>🎮 Navigation</h3>
              <button onClick={handleBackToDashboard} className="nav-button">
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Live Leaderboard Panel - Now below mechanics */}
          <div className="game-leaderboard-panel">
            <LiveLeaderboard />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GamePage;
