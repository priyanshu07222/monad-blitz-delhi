import Phaser from "phaser";
import { PreloadScene } from "../scenes/PreloadScene.js";
import { MenuScene } from "../scenes/MenuScene.js";
import { GameScene } from "../scenes/GameScene.js";
import { EndGameScene } from "../scenes/EndGameScene.js";
import { web3Service } from "./Web3Service.js";

class GameService {
  constructor() {
    this.game = null;
    this.isGameRunning = false;
  }

  initializeGame() {
    if (this.game) {
      //console.log("Game already initialized");
      return this.game;
    }

    //console.log("🚀 Initializing Phaser game...");

    // Check if container exists
    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) {
      console.error("❌ Game container 'game-container' not found in DOM!");
      return null;
    }

    //console.log("✅ Game container found, creating Phaser game...");

    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: 1200,
      height: 600,
      parent: "game-container", // This div should exist in your React component
      backgroundColor: "#2c3e50",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: [PreloadScene, MenuScene, GameScene, EndGameScene],
    };

    try {
      // Initialize Phaser game
      this.game = new Phaser.Game(config);
      this.isGameRunning = true;

      // Make wallet manager and web3 service globally available to game scenes
      window.web3Service = web3Service;

      // Make leaderboard refresh functions available to game scenes
      window.refreshGameLeaderboard = () => {
        if (window.loadGameLeaderboard) {
          window.loadGameLeaderboard();
        }
      };

      //console.log("✅ Rocket Candle: Game initialized with Web3 integration!");
      return this.game;
    } catch (error) {
      console.error("❌ Failed to initialize Phaser game:", error);
      return null;
    }
  }

  startGame() {
    if (!this.game) {
      this.initializeGame();
    }

    if (this.game) {
      // Make sure the game container is visible
      const gameContainer = document.getElementById("game-container");
      if (gameContainer) {
        gameContainer.style.display = "block";
        gameContainer.style.visibility = "visible";
        //console.log("📱 Game container made visible");
      } else {
        console.error("❌ Game container not found!");
      }

      // Start with MenuScene or go directly to GameScene
      this.game.scene.start("MenuScene");
      //console.log("🎮 Game started with MenuScene!");
    }
  }

  destroyGame() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.isGameRunning = false;
      //console.log("🛑 Game destroyed");
    }
  }

  pauseGame() {
    if (this.game) {
      this.game.scene.pause();
    }
  }

  resumeGame() {
    if (this.game) {
      this.game.scene.resume();
    }
  }
}

export const gameService = new GameService();

// Export for backward compatibility
export const initializeGame = () => {
  return gameService.initializeGame();
};

export const startGame = () => {
  return gameService.startGame();
};
