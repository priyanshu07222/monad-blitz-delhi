import { useEffect, useRef } from "react";
import { useWalletContext } from "../../hooks/useWalletContext";

const GameContainer = ({ onGameEnd, onGameStart }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const { isConnected, address, rocketFuelBalance } = useWalletContext();

  useEffect(() => {
    // Only initialize game if wallet is connected
    if (!isConnected || !gameRef.current) return;

    const initializeGame = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const Phaser = await import("phaser");

        // Import game scenes
        const { PreloadScene } = await import("../../scenes/PreloadScene.js");
        const { MenuScene } = await import("../../scenes/MenuScene.js");
        const { GameScene } = await import("../../scenes/GameScene.js");
        const { EndGameScene } = await import("../../scenes/EndGameScene.js");

        // Game configuration
        const config = {
          type: Phaser.AUTO,
          width: 1200,
          height: 800,
          parent: gameRef.current,
          backgroundColor: "#1a1a2e",
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0 },
              debug: false,
            },
          },
          scene: [PreloadScene, MenuScene, GameScene, EndGameScene],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: gameRef.current,
            width: 1200,
            height: 800,
          },
        };

        // Create and store the game instance
        phaserGameRef.current = new Phaser.Game(config);

        // Pass wallet context to game scenes
        phaserGameRef.current.registry.set("walletManager", {
          isConnected,
          address,
          rocketFuelBalance,
        });

        // Set up game event handlers
        phaserGameRef.current.events.on("game-start", () => {
          if (onGameStart) onGameStart();
        });

        phaserGameRef.current.events.on("game-end", (score) => {
          if (onGameEnd) onGameEnd(score);
        });
      } catch (error) {
        console.error("Failed to initialize game:", error);
      }
    };

    initializeGame();

    // Cleanup function
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [isConnected, address, rocketFuelBalance, onGameEnd, onGameStart]);

  if (!isConnected) {
    return (
      <div
        className="flex items-center justify-center h-96 rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Connect Your Wallet
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            Please connect your wallet to start playing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={gameRef}
        className="w-full h-auto bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
        style={{ aspectRatio: "1200/800" }}
      />
      {/* Game overlay with wallet info */}
      <div
        className="absolute top-4 right-4 backdrop-blur-sm rounded-lg p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div
          className="text-sm font-mono"
          style={{ color: "var(--text-score)" }}
        >
          FUEL: {rocketFuelBalance}
        </div>
        <div
          className="text-xs font-mono"
          style={{ color: "var(--text-address)" }}
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
