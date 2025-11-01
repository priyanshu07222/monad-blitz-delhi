import { UIComponents } from "../components/UIComponents.js";
import { MarketDataProvider } from "../data/MarketDataProvider.js";
import { KeyboardTimerController } from "../utils/KeyboardTimerController.js";

/**
 * GameScene - Main gameplay scene for Rocket Candle
 * Handles all game mechanics, physics, and player interactions
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    // Game state variables
    this.currentLevel = 0;
    this.score = 0;
    this.enemiesRemaining = 0;
    this.totalEnemiesInLevel = 0; // Track total enemies generated
    this.maxLevels = MarketDataProvider.getTotalLevels(); // Total number of levels from data provider
    this.launchAttempts = 0; // Track total number of rockets launched across all levels

    // Level attempt system
    this.maxAttemptsPerLevel = 3; // Maximum attempts allowed per level
    this.currentLevelAttempts = 0; // Attempts used in current level
    this.gameOver = false; // Flag for game over state

    // Wallet validation tracking
    this.lastWalletCheck = 0;
    this.walletDisconnectedOverlay = null;

    // Candlestick barrier system - now using MarketDataProvider
    this.candlestickData = MarketDataProvider.generateGameLevels();
    this.candlestickSprites = []; // Store generated candlestick sprites

    // Rocket launcher properties
    this.launcher = null;
    this.launchAngle = 45; // degrees (15-75 range)
    this.launchPower = 50; // percentage (0-100 range)
    this.maxLaunchSpeed = 800; // pixels per second
    this.canLaunch = true;

    // Rocket physics properties
    this.airResistance = 0.998; // Slight air resistance (0.2% drag per frame) for realistic trajectory
    this.explosionSize = 60; // Explosion radius in pixels
    this.rocketTrail = []; // Store trail points for visual effect

    // Trajectory prediction properties
    this.trajectoryGraphics = null;
    this.showTrajectory = true;
    this.trajectoryPoints = [];
    this.gravity = 300; // matches physics world gravity
    this.trajectoryTimer = null; // For temporary trajectory display
    this.trajectoryDisplayTime = 1500; // milliseconds to show trajectory after adjustment

    // Physics groups
    this.rockets = null;
    this.candlesticks = null;
    this.blocks = null;
    this.enemies = null;

    // UI elements
    this.scoreText = null;
    this.levelText = null;
    this.enemiesText = null;
    this.angleSlider = null;
    this.powerSlider = null;
    this.launchButton = null;
    this.angleText = null;
    this.powerText = null;

    // Keyboard and timer controller
    this.keyboardTimerController = null;
    this.angleStepSize = 2; // degrees per key press
    this.powerStepSize = 5; // percentage per key press

    // Legacy timer properties (kept for compatibility)
    this.launchTimer = null;
    this.timerBar = null;
    this.timerText = null;
    this.timerDuration = 8000; // 8 seconds in milliseconds
    this.isTimerActive = false;
    this.timerStartTime = 0;
  }

  create() {
    console.log("🎮 GameScene: Initializing main game scene");

    // CRITICAL: Validate wallet connection before starting game
    if (!this.validateWalletForGameStart()) {
      return; // Exit early if wallet validation fails
    }

    // Set world bounds (1200x600 as updated)
    this.physics.world.setBounds(0, 0, 1200, 600);

    // Set camera bounds
    this.cameras.main.setBounds(0, 0, 1200, 600);
    this.cameras.main.setBackgroundColor("#87CEEB"); // Sky blue background

    // Initialize wallet and Web3 services
    this.initializeWeb3();

    // Create ground/floor collision boundary
    this.createGround();

    // Initialize physics groups
    this.initializePhysicsGroups();

    // Set up HUD
    this.createHUD();

    // Create rocket launcher system
    this.createLauncher();

    // Generate candlestick barriers for current level
    this.generateCandlestickBarriers();

    // Create trajectory prediction system
    this.createTrajectorySystem();

    // Set up keyboard controls
    this.setupKeyboardControls();

    // Initialize scene state
    this.initializeScene();

    console.log("✅ GameScene: Main game scene initialized successfully");
  }

  /**
   * Set up keyboard controls with timer lock system
   */
  setupKeyboardControls() {
    // Initialize the keyboard timer controller
    this.keyboardTimerController = new KeyboardTimerController(this, {
      angleMin: 15,
      angleMax: 75,
      powerMin: 0,
      powerMax: 100,
      angleStepSize: this.angleStepSize,
      powerStepSize: this.powerStepSize,
      timerDuration: this.timerDuration,
      onAngleChange: (angle) => {
        this.updateLauncherRotation();
        this.updateControlDisplay();
        this.showTemporaryTrajectory();
      },
      onPowerChange: (power) => {
        this.updateControlDisplay();
        this.showTemporaryTrajectory();
      },
      onAutoLaunch: () => {
        this.launchRocket();
      },
    });

    console.log("✅ Keyboard controls and timer lock system initialized");
  }

  /**
   * Create ground/floor collision boundary
   */
  createGround() {
    // Ground height at y=550 (50px from bottom)
    this.groundY = 550;

    // Create visible ground
    this.ground = this.add
      .rectangle(600, this.groundY, 1200, 100, 0x8b4513) // Brown ground
      .setOrigin(0.5, 0);

    // Create physics body for ground collision
    this.groundBody = this.physics.add.staticGroup();
    const groundCollider = this.groundBody.create(600, this.groundY, null); // Updated x center
    groundCollider.setSize(1200, 50); // Updated width
    groundCollider.setVisible(false);

    console.log("✅ Ground collision boundary created at y=" + this.groundY);
  }

  /**
   * Initialize all physics groups for game objects
   */
  initializePhysicsGroups() {
    // Create physics groups for different object types
    this.rockets = this.physics.add.group({
      defaultKey: "rocket",
      maxSize: 1, // Only one rocket at a time
    });

    this.candlesticks = this.physics.add.staticGroup();
    this.blocks = this.physics.add.staticGroup(); // Make blocks static
    this.enemies = this.physics.add.group();

    // Set up collision detection between groups
    this.setupCollisions();

    console.log("✅ Physics groups initialized");
  }

  /**
   * Set up collision detection between different physics groups
   */
  setupCollisions() {
    // Rocket collisions with ground
    this.physics.add.collider(
      this.rockets,
      this.groundBody,
      this.onRocketHitGround,
      null,
      this
    );

    // Rocket collisions with candlesticks
    this.physics.add.collider(
      this.rockets,
      this.candlesticks,
      this.onRocketHitCandlestick,
      null,
      this
    );

    // Rocket collisions with blocks
    this.physics.add.collider(
      this.rockets,
      this.blocks,
      this.onRocketHitBlock,
      null,
      this
    );

    // Rocket collisions with enemies
    this.physics.add.overlap(
      this.rockets,
      this.enemies,
      this.onRocketHitEnemy,
      null,
      this
    );

    // Block collisions with ground (not needed for static blocks)
    // this.physics.add.collider(this.blocks, this.groundBody);

    // Block collisions with candlesticks (not needed for static blocks)
    // this.physics.add.collider(this.blocks, this.candlesticks);

    // Block to block collisions (not needed for static blocks)
    // this.physics.add.collider(this.blocks, this.blocks);

    // Enemy collisions with ground
    this.physics.add.collider(this.enemies, this.groundBody);

    // Enemy collisions with candlesticks
    this.physics.add.collider(this.enemies, this.candlesticks);

    // Enemy collisions with blocks (so they can walk on them)
    this.physics.add.collider(this.enemies, this.blocks);
  }

  /**
   * Create HUD elements (score, level, enemies remaining)
   */
  createHUD() {
    // Score display (top-left)
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial",
      // Removed stroke for cleaner look
    });

    // Level display (top-center)
    this.levelText = this.add
      .text(600, 16, "Level: 3", {
        // Updated center position for 1200px width
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
        // Removed stroke for cleaner look
      })
      .setOrigin(0.5, 0);

    // Enemies remaining (top-right)
    this.enemiesText = this.add
      .text(1184, 16, "Enemies: 0", {
        // Updated for 1200px width (1200-16)
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
        // Removed stroke for cleaner look
      })
      .setOrigin(1, 0);

    // Total attempts display (top-left, below score)
    this.attemptsText = this.add.text(16, 50, "Total: 0", {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Arial",
    });

    // Level attempts display (top-left, below total attempts)
    this.levelAttemptsText = this.add.text(16, 75, "Attempt: 0/3", {
      fontSize: "18px",
      fill: "#ff6666",
      fontFamily: "Arial",
    });

    console.log("✅ HUD elements created");
  }

  /**
   * Update HUD displays
   */
  updateHUD() {
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    }
    if (this.levelText) {
      this.levelText.setText(`Level: ${this.currentLevel + 1}`);
    }
    if (this.enemiesText) {
      this.enemiesText.setText(`Enemies: ${this.enemiesRemaining}`);
    }
    if (this.attemptsText) {
      this.attemptsText.setText(`Total: ${this.launchAttempts}`);
    }
    if (this.levelAttemptsText) {
      const remaining = this.maxAttemptsPerLevel - this.currentLevelAttempts;
      const color =
        remaining <= 1 ? "#ff0000" : remaining === 2 ? "#ffaa00" : "#ff6666";
      this.levelAttemptsText.setText(
        `Attempt: ${this.currentLevelAttempts}/${this.maxAttemptsPerLevel}`
      );
      this.levelAttemptsText.setColor(color);
    }
  }

  /**
   * Initialize scene state and start first level
   */
  initializeScene() {
    // Reset game state
    this.currentLevel = 0;
    this.score = 0;
    this.enemiesRemaining = 0;
    this.launchAttempts = 0;
    this.currentLevelAttempts = 0;
    this.gameOver = false;

    // Update HUD
    this.updateHUD();

    console.log("✅ Scene state initialized");
  }

  /**
   * Clear existing candlesticks, blocks, and enemies for level transitions
   */
  clearCandlesticks() {
    // Clear all candlestick barriers
    this.candlesticks.clear(true, true);

    // Clear all blocks
    this.blocks.clear(true, true);

    // Clear all enemies
    this.enemies.clear(true, true);

    // Clear candlestick sprites array
    this.candlestickSprites = [];

    console.log("🧹 Cleared existing candlesticks, blocks, and enemies");
  }

  /**
   * Generate candlestick barriers for the current level
   */
  generateCandlestickBarriers() {
    // Clear existing candlesticks
    this.clearCandlesticks();

    // Reset enemy counters and level attempts (but keep cumulative launch attempts)
    this.enemiesRemaining = 0;
    this.totalEnemiesInLevel = 0;
    this.currentLevelAttempts = 0; // Reset attempts for new level
    // Note: launchAttempts is NOT reset - it's cumulative across all levels

    const levelData = this.candlestickData[this.currentLevel];
    if (!levelData) {
      console.warn(`⚠️ No data found for level ${this.currentLevel}`);
      return;
    }

    const candlesticks = levelData.candlesticks;
    const startX = 350; // Start position closer to launcher (reduced from 400)
    const barWidth = 30; // Thinner candlestick barriers (reduced from 40)
    const spacing = 80; // Reduced spacing between barriers (reduced from 100)

    console.log(
      `📊 Generating ${candlesticks.length} candlestick barriers for level ${this.currentLevel}: ${levelData.name}`
    );

    candlesticks.forEach((candle, index) => {
      const x = startX + index * spacing;

      // Create candlestick barrier (replaces fixed-height platform)
      const { barrier, topY, height } = this.createCandlestickBarrier(
        x,
        this.groundY,
        candle,
        barWidth
      );

      // Build structures on top of candlestick barrier
      if (index % 2 === 0) {
        // Every 2nd candlestick gets block structures
        this.generateBlocksOnCandlestickTop(
          x,
          topY, // Top of the candlestick barrier
          barWidth, // Width for block placement
          candle, // Candle data for structure variation
          height // Barrier height for difficulty scaling
        );
      }

      // Removed: displayMinimalPriceIndicator call (cleaner UI)
    });

    // Update total enemies count
    this.totalEnemiesInLevel = this.enemiesRemaining;

    // Update HUD with new enemy count
    this.updateHUD();

    console.log(
      `✅ Generated ${candlesticks.length} candlestick barriers with variable heights and ${this.enemiesRemaining} enemies`
    );
  }

  /**
   * Create a candlestick barrier with height based on price volatility
   * @param {number} x - X position
   * @param {number} groundY - Ground Y position
   * @param {object} candle - OHLC candle data
   * @param {number} barWidth - Width of the barrier
   * @returns {object} Barrier data with sprite and topY position
   */
  createCandlestickBarrier(x, groundY, candle, barWidth) {
    // Calculate height based on high-low range
    const priceRange = candle.high - candle.low;
    const maxRange = this.getMaxPriceRangeForLevel();
    const MIN_HEIGHT = 60; // Minimum barrier height
    const MAX_HEIGHT = 200; // Maximum barrier height

    const scaledHeight = Math.max(
      MIN_HEIGHT,
      Math.min(MAX_HEIGHT, (priceRange / maxRange) * MAX_HEIGHT)
    );

    // Determine color based on bull/bear market
    const color = candle.close >= candle.open ? 0x00ff00 : 0xff3333; // Green/Red

    // Create vertical barrier positioned from ground up
    const barY = groundY - scaledHeight / 2;
    const barrier = this.candlesticks.create(x, barY, "candlestick"); // Use candlestick texture instead of null
    barrier.setDisplaySize(barWidth, scaledHeight);
    barrier.setTint(color);
    // No need to call setImmovable() since static bodies are already immovable
    barrier.refreshBody();

    // Store reference for cleanup
    this.candlestickSprites.push({
      sprite: barrier,
      physics: barrier,
      data: candle,
      height: scaledHeight,
    });

    // Return barrier info and top position for block placement
    return {
      barrier,
      topY: groundY - scaledHeight,
      height: scaledHeight,
    };
  }

  /**
   * Get maximum price range for the current level (for height scaling)
   * @returns {number} Maximum price range in the current level
   */
  getMaxPriceRangeForLevel() {
    const levelData = this.candlestickData[this.currentLevel];
    if (!levelData || !levelData.candlesticks.length) return 1;

    return Math.max(...levelData.candlesticks.map((c) => c.high - c.low));
  }

  /**
   * Generate blocks on top of a candlestick barrier (simplified to single vertical stacks)
   * @param {number} x - X position
   * @param {number} topY - Top Y position of the candlestick barrier
   * @param {number} width - Width for block placement
   * @param {object} candle - Candle data for structure variation
   * @param {number} barrierHeight - Height of the barrier for difficulty scaling
   */
  generateBlocksOnCandlestickTop(x, topY, width, candle, barrierHeight) {
    // Determine structure complexity based on barrier height and candle volatility
    const priceRange = candle.high - candle.low;
    const maxRange = this.getMaxPriceRangeForLevel();
    const volatilityFactor = priceRange / maxRange;

    const blockWidth = 25; // Reduced to match thinner candlesticks (reduced from 30)
    const blockHeight = 20;

    // Determine stack height based on volatility (2-4 elements total)
    const stackHeight = Math.floor(2 + volatilityFactor * 2); // 2-4 elements high max

    // Create alternating vertical stack: box → enemy → box → enemy
    for (let layer = 0; layer < stackHeight; layer++) {
      const elementY = topY - layer * blockHeight - blockHeight / 2;

      // Alternate between blocks (even layers) and enemies (odd layers)
      if (layer % 2 === 0) {
        // Even layer: Create block
        this.createDestructibleBlock(
          x, // Single column at center
          elementY,
          blockWidth,
          blockHeight,
          layer
        );
      } else {
        // Odd layer: Create enemy
        this.createEnemy(x, elementY);
      }
    }

    console.log(
      `🏗️ Created alternating ${stackHeight}-element vertical stack at (${x}, ${topY}) with ${Math.ceil(
        stackHeight / 2
      )} blocks and ${Math.floor(stackHeight / 2)} enemies`
    );
  }

  /**
   * Create a destructible block sprite with physics
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Block width
   * @param {number} height - Block height
   * @param {number} layer - Layer index for color variation
   */
  createDestructibleBlock(x, y, width, height, layer) {
    // Use blue color scheme for cleaner look
    const blockColors = [0xadd8e6, 0x87ceeb, 0x4682b4]; // Light Blue, Sky Blue, Steel Blue
    const color = blockColors[layer % blockColors.length];

    // Create geometric rectangle instead of sprite for cleaner look
    const block = this.add.rectangle(x, y, width, height, color);

    // Add subtle border for definition
    block.setStrokeStyle(2, 0x000080, 0.3); // Dark blue border with low opacity

    // Add to physics group manually
    this.physics.add.existing(block, true); // true makes it static/immovable
    this.blocks.add(block);

    // No need to call setImmovable() since static bodies are already immovable

    console.log(
      `🧱 Created geometric block at (${x}, ${y}) with blue color ${color.toString(
        16
      )}`
    );
    return block;
  }

  /**
   * Create an enemy sprite with basic properties
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  createEnemy(x, y) {
    // Create geometric circle instead of sprite for cleaner look
    const enemy = this.add.circle(x, y, 10, 0x800080); // Purple circle, radius 10

    // Add subtle border for definition
    enemy.setStrokeStyle(2, 0x4a0040, 0.6); // Darker purple border

    // Add to physics group manually
    this.physics.add.existing(enemy);
    this.enemies.add(enemy);

    // Add basic AI properties
    enemy.shouldMove = false; // Static positioning for now
    enemy.moveDirection = Math.random() > 0.5 ? 1 : -1; // Random initial direction
    enemy.moveSpeed = 20; // Slow movement speed

    // Add physics properties
    enemy.body.setBounce(0.2);
    enemy.body.setCollideWorldBounds(true);

    // Increment enemy counter
    this.enemiesRemaining++;

    console.log(`👾 Created geometric enemy at (${x}, ${y})`);
    return enemy;
  }

  /**
   * Create rocket launcher system
   */
  createLauncher() {
    // Create launcher sprite with pivot at base (positioned on left side)
    this.launcher = this.add
      .image(160, this.groundY - 20, "launcher") // Moved launcher higher above ground
      .setOrigin(0.5, 1) // Pivot at bottom center
      .setScale(1.2); // Slightly larger launcher

    // Set initial rotation based on launch angle
    this.updateLauncherRotation();

    // Create angle control slider (15°-75° range) - vertical, left of launcher
    this.angleSlider = UIComponents.createVerticalSlider(
      this,
      50, // Moved further left
      this.groundY - 200, // Moved higher up
      15,
      75,
      this.launchAngle,
      (value) => {
        this.launchAngle = Math.round(value);
        this.updateLauncherRotation();
        this.updateControlDisplay();
        this.showTemporaryTrajectory(); // Show trajectory temporarily
        // Start timer when slider is adjusted
        if (this.keyboardTimerController) {
          this.keyboardTimerController.startTimer();
        }
      },
      150 // height of vertical slider, increased
    );

    // Create power control slider (0-100% range) - vertical, between angle and launcher
    this.powerSlider = UIComponents.createVerticalSlider(
      this,
      100, // Adjusted x position
      this.groundY - 200, // Moved higher up
      0,
      100,
      this.launchPower,
      (value) => {
        this.launchPower = Math.round(value);
        this.updateControlDisplay();
        this.showTemporaryTrajectory(); // Show trajectory temporarily
        // Start timer when slider is adjusted
        if (this.keyboardTimerController) {
          this.keyboardTimerController.startTimer();
        }
      },
      150 // height of vertical slider, increased
    );

    // Create launch button (positioned above the ground)
    this.launchButton = UIComponents.createButton(
      this,
      150,
      this.groundY + 25, // Moved above ground level
      "LAUNCH",
      () => this.launchRocket(),
      {
        width: 120, // Wider button
        height: 40, // Taller button
        fontSize: "18px", // Larger font
        fill: 0x00ff00, // Bright green background
        hoverFill: 0x00cc00, // Darker green on hover
        textColor: "#000000", // Black text for contrast
      }
    );

    // Create control display labels
    this.createControlLabels();

    console.log("✅ Launcher controls created");
  }

  /**
   * Update launcher rotation based on launch angle
   */
  updateLauncherRotation() {
    // Convert angle to radians and apply rotation (negative for correct direction)
    const angleRad = Phaser.Math.DegToRad(-this.launchAngle);
    this.launcher.setRotation(angleRad);
  }

  /**
   * Create control display labels
   */
  createControlLabels() {
    // Angle label and value (for vertical slider on far left)
    this.add
      .text(50, this.groundY - 200 - 90, "Angle:", {
        // Adjusted position to be above slider
        fontSize: "16px", // Larger font
        fill: "#ffffff",
        fontFamily: "Arial",
        // Removed stroke for cleaner look
      })
      .setOrigin(0.5, 0.5);

    this.angleText = this.add
      .text(50, this.groundY - 200 + 90, `${this.launchAngle}°`, {
        // Adjusted position to be below slider
        fontSize: "18px", // Larger font
        fill: "#ffff00",
        fontFamily: "Arial",
        // Removed stroke for cleaner look
      })
      .setOrigin(0.5, 0.5);

    // Power label and value (for vertical slider in middle)
    this.add
      .text(100, this.groundY - 200 - 90, "Power:", {
        // Adjusted position to be above slider
        fontSize: "16px", // Larger font
        fill: "#ffffff",
        fontFamily: "Arial",
        // Removed stroke for cleaner look
      })
      .setOrigin(0.5, 0.5);

    this.powerText = this.add
      .text(100, this.groundY - 200 + 90, `${this.launchPower}%`, {
        // Adjusted position to be below slider
        fontSize: "18px", // Larger font
        fill: "#ff6b6b",
        fontFamily: "Arial",
        // Removed stroke for cleaner look
      })
      .setOrigin(0.5, 0.5);
  }

  /**
   * Update control display values
   */
  updateControlDisplay() {
    if (this.angleText) {
      this.angleText.setText(`${this.launchAngle}°`);
    }
    if (this.powerText) {
      this.powerText.setText(`${this.launchPower}%`);
    }

    // Update slider handle positions to match keyboard changes
    this.updateSliderPositions();
  }

  /**
   * Update slider handle positions to match current values
   */
  updateSliderPositions() {
    // Update angle slider handle position
    if (this.angleSlider && this.angleSlider.handle) {
      const angleSliderConfig = {
        min: 15,
        max: 75,
        height: 150,
        centerY: this.groundY - 200,
      };

      const angleProgress =
        (this.launchAngle - angleSliderConfig.min) /
        (angleSliderConfig.max - angleSliderConfig.min);
      const angleHandleY =
        angleSliderConfig.centerY +
        angleSliderConfig.height / 2 -
        angleProgress * angleSliderConfig.height;
      this.angleSlider.handle.y = angleHandleY;
    }

    // Update power slider handle position
    if (this.powerSlider && this.powerSlider.handle) {
      const powerSliderConfig = {
        min: 0,
        max: 100,
        height: 150,
        centerY: this.groundY - 200,
      };

      const powerProgress =
        (this.launchPower - powerSliderConfig.min) /
        (powerSliderConfig.max - powerSliderConfig.min);
      const powerHandleY =
        powerSliderConfig.centerY +
        powerSliderConfig.height / 2 -
        powerProgress * powerSliderConfig.height;
      this.powerSlider.handle.y = powerHandleY;
    }
  }

  /**
   * Launch rocket with current angle and power settings
   */
  launchRocket() {
    // Validate launch conditions
    if (!this.canLaunch) {
      console.log("⚠️ Cannot launch - rocket already in flight");
      return;
    }

    if (this.launchPower <= 0) {
      console.log("⚠️ Cannot launch - power must be greater than 0");
      return;
    }

    // Clear trajectory preview during flight
    this.trajectoryGraphics.clear();

    // Calculate launch velocity components
    const angleRad = Phaser.Math.DegToRad(this.launchAngle);
    const speed = (this.launchPower / 100) * this.maxLaunchSpeed;

    const velocityX = Math.cos(angleRad) * speed;
    const velocityY = -Math.sin(angleRad) * speed; // Negative for upward movement

    // Create rocket sprite at launcher position
    const rocket = this.rockets.create(
      this.launcher.x + Math.cos(angleRad) * 30, // Offset from launcher
      this.launcher.y - Math.sin(angleRad) * 30,
      "rocket"
    );

    // Set rocket physics properties
    rocket.setVelocity(velocityX, velocityY);
    rocket.setRotation(angleRad); // Rotate rocket to match trajectory
    rocket.setBounce(0.1); // Reduced bounce for more realistic physics
    // Note: No setDrag() here - air resistance is handled in updateRocketPhysics()
    rocket.setScale(1.2); // Make rocket slightly larger for better visibility

    // Add custom properties for enhanced physics
    rocket.initialVelocityX = velocityX;
    rocket.initialVelocityY = velocityY;
    rocket.trailPoints = [];
    rocket.explosionTriggered = false;

    // Disable launching until rocket is destroyed
    this.canLaunch = false;

    // Reset timer when rocket is launched
    if (this.keyboardTimerController) {
      this.keyboardTimerController.stopTimer();
    }

    // Increment both total attempts and current level attempts
    this.launchAttempts++;
    this.currentLevelAttempts++;

    // Update HUD to reflect new attempt counts
    this.updateHUD();

    console.log(
      `🚀 Rocket launched! Angle: ${this.launchAngle}°, Power: ${this.launchPower}% (Total: #${this.launchAttempts}, Level: ${this.currentLevelAttempts}/${this.maxAttemptsPerLevel})`
    );
  }

  /**
   * Create trajectory prediction system
   */
  createTrajectorySystem() {
    // Create graphics object for trajectory line
    this.trajectoryGraphics = this.add.graphics();

    // Initial trajectory calculation
    this.updateTrajectory();

    console.log("📈 Trajectory prediction system created");
  }

  /**
   * Calculate and update trajectory preview
   */
  updateTrajectory() {
    if (!this.trajectoryGraphics || !this.showTrajectory) {
      return;
    }

    // Clear previous trajectory
    this.trajectoryGraphics.clear();

    // Calculate trajectory physics
    const trajectoryPoints = this.calculateTrajectoryPoints();

    if (trajectoryPoints.length > 0) {
      this.renderTrajectoryLine(trajectoryPoints);
    }
  }

  /**
   * Show trajectory temporarily when adjusting sliders
   */
  showTemporaryTrajectory() {
    // Clear any existing timer
    if (this.trajectoryTimer) {
      this.trajectoryTimer.destroy();
    }

    // Show trajectory immediately
    this.updateTrajectory();

    // Set timer to hide trajectory after delay
    this.trajectoryTimer = this.time.delayedCall(
      this.trajectoryDisplayTime,
      () => {
        this.trajectoryGraphics.clear();
        this.trajectoryTimer = null;
      }
    );
  }

  /**
   * Calculate parabolic trajectory points (limited to 75% of full path)
   */
  calculateTrajectoryPoints() {
    const points = [];

    // Initial conditions
    const angleRad = Phaser.Math.DegToRad(this.launchAngle);
    const speed = (this.launchPower / 100) * this.maxLaunchSpeed;

    // Initial velocity components
    const v0x = Math.cos(angleRad) * speed;
    const v0y = -Math.sin(angleRad) * speed; // Negative for upward movement

    // Starting position (from launcher)
    const startX = this.launcher.x + Math.cos(angleRad) * 30;
    const startY = this.launcher.y - Math.sin(angleRad) * 30;

    // Calculate trajectory points over time
    const timeStep = 0.05; // 50ms intervals
    const maxTime = 5.0; // 5 seconds maximum

    for (let t = 0; t <= maxTime; t += timeStep) {
      // Physics equations: x = x0 + v0x*t, y = y0 + v0y*t + 0.5*g*t^2
      const x = startX + v0x * t;
      const y = startY + v0y * t + 0.5 * this.gravity * t * t;

      // Stop calculating if trajectory goes below ground or off screen
      if (y >= this.groundY || x > 1200 || x < 0) {
        break;
      }

      points.push({ x, y });
    }

    // Limit to 75% of the trajectory points
    const limitedPoints = points.slice(0, Math.floor(points.length * 0.75));

    this.trajectoryPoints = limitedPoints;
    return limitedPoints;
  }

  /**
   * Render trajectory preview line
   */
  renderTrajectoryLine(points) {
    if (points.length < 2) return;

    // Draw trajectory as white dots only (remove continuous line)
    this.trajectoryGraphics.fillStyle(0xffffff, 0.8); // White dots with high opacity

    // Draw dots for every point (not every 5th)
    for (let i = 0; i < points.length; i++) {
      this.trajectoryGraphics.fillCircle(points[i].x, points[i].y, 2);
    }
  }

  /**
   * Validate wallet connection before starting game
   * @returns {boolean} True if wallet is valid for game start
   */
  validateWalletForGameStart() {
    console.log("🔍 Validating wallet for game start...");

    // Check if wallet manager exists
    if (!window.walletManager) {
      console.error("❌ Wallet manager not available");
      this.showGameError(
        "Wallet manager not initialized",
        "Please refresh the page and try again."
      );
      return false;
    }

    // Check if wallet is connected
    if (!window.walletManager.isConnected) {
      console.error("❌ Wallet not connected");
      this.showGameError(
        "Wallet Not Connected",
        "Please connect your wallet before starting the game."
      );
      return false;
    }

    // Check if on correct network
    if (!window.walletManager.isCorrectNetwork) {
      console.error("❌ Wrong network");
      this.showGameError(
        "Wrong Network",
        "Please switch to Monad Testnet before starting the game."
      );
      return false;
    }

    // Check if wallet is ready for game operations
    if (!window.walletManager.isReadyForGame()) {
      console.error("❌ Wallet not ready for game operations");
      this.showGameError(
        "Wallet Not Ready",
        "Please ensure your wallet is connected to Monad Testnet."
      );
      return false;
    }

    console.log("✅ Wallet validation passed for game start");
    return true;
  }

  /**
   * Show game error and return to menu
   */
  showGameError(title, message) {
    // Create error overlay
    const errorOverlay = this.add.rectangle(600, 300, 800, 400, 0x000000, 0.8);

    // Error title
    const errorTitle = this.add
      .text(600, 200, title, {
        fontSize: "32px",
        fill: "#ff4444",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Error message
    const errorMessage = this.add
      .text(600, 280, message, {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    // Return to menu button
    const returnButton = this.add
      .rectangle(600, 380, 200, 50, 0x444444)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("🔄 Returning to menu due to wallet error");
        this.scene.start("MenuScene");
      })
      .on("pointerover", () => returnButton.setFillStyle(0x666666))
      .on("pointerout", () => returnButton.setFillStyle(0x444444));

    const returnText = this.add
      .text(600, 380, "Return to Menu", {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Auto return to menu after 5 seconds
    this.time.delayedCall(5000, () => {
      this.scene.start("MenuScene");
    });
  }

  /**
   * Show wallet disconnected overlay
   */
  showWalletDisconnectedOverlay() {
    // Create overlay
    const overlay = this.add.rectangle(600, 300, 1200, 600, 0x000000, 0.8);

    // Create message
    const message = this.add
      .text(600, 250, "🔗 Wallet Disconnected!", {
        fontSize: "48px",
        fill: "#ff6666",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    const subMessage = this.add
      .text(600, 320, "Please reconnect your wallet\nto continue playing", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Create return to menu button
    const returnButton = this.add
      .rectangle(600, 400, 200, 50, 0x3498db)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("🔄 Returning to menu...");
        this.scene.start("MenuScene");
      });

    const buttonText = this.add
      .text(600, 400, "Return to Menu", {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Store references for cleanup
    this.walletDisconnectedOverlay = {
      overlay,
      message,
      subMessage,
      returnButton,
      buttonText,
    };
  }

  /**
   * Update simple enemy AI movement
   */
  updateEnemyAI() {
    this.enemies.children.entries.forEach((enemy) => {
      // Skip AI movement if enemy shouldn't move (static positioning)
      if (!enemy.shouldMove || !enemy.body || enemy.body.moves === false) {
        return;
      }

      // Simple left-right movement (only when enabled)
      if (enemy.moveDirection) {
        enemy.body.setVelocityX(enemy.moveDirection * enemy.moveSpeed);

        // Change direction if hitting world bounds or randomly
        if (enemy.x <= 50 || enemy.x >= 1150 || Math.random() < 0.01) {
          enemy.moveDirection *= -1;
        }
      }
    });
  }

  /**
   * Update rocket trail visual effect
   */
  updateRocketTrail(rocket) {
    // Calculate the rocket's tail position (opposite to the nose direction)
    // The rocket sprite is 20x60px.
    // The rocket's visual rotation is set in updateRocketPhysics.
    const rocketLength = 30; // Half the rocket height (60px / 2)

    // Determine the angle of the rocket's tail based on its current velocity.
    // This is 180 degrees (Math.PI) opposite to the direction of movement.
    const angleOfVelocity = Math.atan2(
      rocket.body.velocity.y,
      rocket.body.velocity.x
    );
    const tailAngle = angleOfVelocity + Math.PI; // Pointing directly opposite to velocity

    const tailX = rocket.x + Math.cos(tailAngle) * rocketLength;
    const tailY = rocket.y + Math.sin(tailAngle) * rocketLength;

    // Add tail position to trail (not center position)
    rocket.trailPoints.push({ x: tailX, y: tailY, time: this.time.now });

    // Remove old trail points (keep last 20 points or 1 second)
    const maxTrailTime = 1000; // 1 second
    rocket.trailPoints = rocket.trailPoints.filter((point) => {
      return this.time.now - point.time < maxTrailTime;
    });

    // Limit trail length
    if (rocket.trailPoints.length > 20) {
      rocket.trailPoints.shift();
    }

    // Draw trail if we have at least 2 points
    if (rocket.trailPoints.length >= 2 && !rocket.trailGraphics) {
      rocket.trailGraphics = this.add.graphics();
    }

    if (rocket.trailGraphics && rocket.trailPoints.length >= 2) {
      rocket.trailGraphics.clear();

      // Draw trail as connected line segments with fading alpha
      for (let i = 1; i < rocket.trailPoints.length; i++) {
        const point1 = rocket.trailPoints[i - 1];
        const point2 = rocket.trailPoints[i];

        // Calculate alpha based on age (newer = brighter)
        const age = (this.time.now - point2.time) / 1000; // age in seconds
        const alpha = Math.max(0, 1 - age);

        // Set line style with fading effect
        rocket.trailGraphics.lineStyle(3, 0xff6600, alpha * 0.7);
        rocket.trailGraphics.beginPath();
        rocket.trailGraphics.moveTo(point1.x, point1.y);
        rocket.trailGraphics.lineTo(point2.x, point2.y);
        rocket.trailGraphics.strokePath();
      }
    }
  }

  /**
   * Update rocket physics with enhanced air resistance
   */
  updateRocketPhysics(rocket) {
    // Apply air resistance to rocket velocity
    rocket.body.velocity.x *= this.airResistance;
    rocket.body.velocity.y *= this.airResistance;

    // Update rocket rotation to match velocity direction
    // Add π/2 (90 degrees) because the rocket sprite is created vertically
    // and we want it to point in the direction of travel
    const angle =
      Math.atan2(rocket.body.velocity.y, rocket.body.velocity.x) + Math.PI / 2;
    rocket.setRotation(angle);

    // Add slight scaling effect based on speed for visual enhancement
    const speed = Math.sqrt(
      rocket.body.velocity.x ** 2 + rocket.body.velocity.y ** 2
    );
    const scale = Math.max(0.8, Math.min(1.4, 1 + speed / 1000));
    rocket.setScale(scale);
  }

  /**
   * Initialize Web3 services
   */
  initializeWeb3() {
    // Get global wallet manager and web3 service
    this.walletManager = window.walletManager;
    this.web3Service = window.web3Service;

    // Initialize wallet state
    this.walletConnected = this.walletManager?.isConnected || false;
    this.walletAddress = this.walletManager?.address || null;
    this.fuelBalance = this.walletManager?.fuelBalance || 0;

    // Set up wallet connection callback
    if (this.walletManager) {
      this.walletManager.onConnect((isConnected, address) => {
        this.walletConnected = isConnected;
        this.walletAddress = address;

        if (isConnected) {
          console.log("🔗 Wallet connected in game:", address);
          this.loadFuelBalance();
        } else {
          console.log("🔗 Wallet disconnected in game");
          this.fuelBalance = 0;
        }
      });
    }

    console.log("✅ Web3 services initialized");
  }

  /**
   * Load FUEL balance from blockchain
   */
  async loadFuelBalance() {
    if (!this.walletConnected || !this.web3Service) return;

    try {
      this.fuelBalance = await this.web3Service.getFuelBalance();
      console.log("💰 FUEL balance loaded:", this.fuelBalance);
    } catch (error) {
      console.error("Failed to load FUEL balance:", error);
    }
  }

  /**
   * Submit score to blockchain
   */
  async submitScoreToBlockchain() {
    // Enhanced wallet validation
    if (
      !this.walletConnected ||
      !this.web3Service ||
      !this.walletManager?.isReadyForGame()
    ) {
      console.log("⚠️ Wallet not ready, skipping blockchain submission");
      this.showWalletNotReadyMessage();
      return;
    }

    try {
      console.log("📝 Submitting score to blockchain...");

      // Submit score
      const scoreResult = await this.web3Service.submitScore(
        this.currentLevel + 1,
        this.score
      );

      console.log("✅ Score submitted:", scoreResult.transactionHash);

      // Calculate FUEL reward based on level and score
      const fuelReward = Math.max(
        10,
        (this.currentLevel + 1) * 5 + Math.floor(this.score / 100)
      );

      // Reward FUEL tokens
      const fuelResult = await this.web3Service.rewardFuel(fuelReward);

      console.log("🎁 FUEL reward:", fuelResult.transactionHash);

      // Update balance
      this.loadFuelBalance();

      // Refresh the game leaderboard if it's visible
      if (window.refreshGameLeaderboard) {
        window.refreshGameLeaderboard();
      }

      // Show success message
      this.showBlockchainSuccessMessage(fuelReward);
    } catch (error) {
      console.error("Failed to submit to blockchain:", error);
      this.showBlockchainErrorMessage(error.message);
    }
  }

  /**
   * Show wallet not ready message
   */
  showWalletNotReadyMessage() {
    const message = this.add
      .text(600, 300, "⚠️ Wallet Not Ready\nScore not saved to blockchain", {
        fontSize: "20px",
        fill: "#ffaa00",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Animate message
    this.tweens.add({
      targets: message,
      alpha: 1,
      duration: 500,
      yoyo: true,
      hold: 2000,
      onComplete: () => message.destroy(),
    });
  }

  /**
   * Show blockchain success message
   */
  showBlockchainSuccessMessage(fuelReward, title = "Score Submitted!") {
    const message = this.add
      .text(600, 300, `${title}\n+${fuelReward} FUEL Tokens`, {
        fontSize: "24px",
        fill: "#4CAF50",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Animate message
    this.tweens.add({
      targets: message,
      alpha: 1,
      duration: 500,
      yoyo: true,
      hold: 2000,
      onComplete: () => message.destroy(),
    });
  }

  /**
   * Show blockchain error message
   */
  showBlockchainErrorMessage(errorText) {
    const message = this.add
      .text(600, 300, `Blockchain Error\n${errorText}`, {
        fontSize: "18px",
        fill: "#FF5722",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Animate message
    this.tweens.add({
      targets: message,
      alpha: 1,
      duration: 500,
      yoyo: true,
      hold: 3000,
      onComplete: () => message.destroy(),
    });
  }

  /**
   * Phaser update method - called every frame
   */
  update() {
    // Periodic wallet validation (check every 5 seconds)
    if (this.time.now - this.lastWalletCheck > 5000) {
      this.validateWalletDuringGameplay();
      this.lastWalletCheck = this.time.now;
    }

    // Update rocket trail effects and enhanced physics
    this.rockets.children.entries.forEach((rocket) => {
      this.updateRocketTrail(rocket);
      this.updateRocketPhysics(rocket);

      // Check if rocket has left the game bounds and destroy it
      if (
        rocket.x < -50 ||
        rocket.x > 1250 ||
        rocket.y < -50 ||
        rocket.y > 650
      ) {
        console.log(
          `🚀 Rocket left bounds at (${Math.round(rocket.x)}, ${Math.round(
            rocket.y
          )}) - destroying`
        );
        this.destroyRocket(rocket);
      }
    });

    // Update enemy AI
    this.updateEnemyAI();
  }

  /**
   * Validate wallet connection during gameplay
   */
  validateWalletDuringGameplay() {
    // Skip validation if game is over or already showing wallet error
    if (this.gameOver || this.walletDisconnectedOverlay) {
      return;
    }

    // Check if wallet manager exists and is connected
    if (!window.walletManager || !window.walletManager.isConnected) {
      console.warn("⚠️ Wallet disconnected during gameplay");
      this.handleWalletDisconnectedDuringGame();
      return;
    }

    // Check if on correct network
    if (!window.walletManager.isCorrectNetwork) {
      console.warn("⚠️ Wrong network during gameplay");
      this.handleWrongNetworkDuringGame();
      return;
    }

    // Check if wallet is ready for game operations
    if (!window.walletManager.isReadyForGame()) {
      console.warn("⚠️ Wallet not ready during gameplay");
      this.handleWalletNotReadyDuringGame();
      return;
    }
  }

  /**
   * Handle wallet disconnection during gameplay
   */
  handleWalletDisconnectedDuringGame() {
    // Pause game
    this.physics.pause();
    this.canLaunch = false;

    // Show wallet disconnected overlay
    this.showWalletDisconnectedOverlay();
  }

  /**
   * Handle wrong network during gameplay
   */
  handleWrongNetworkDuringGame() {
    // Pause game
    this.physics.pause();
    this.canLaunch = false;

    // Show network error
    this.showGameError(
      "Wrong Network",
      "Please switch to Monad Testnet to continue playing."
    );
  }

  /**
   * Handle wallet not ready during gameplay
   */
  handleWalletNotReadyDuringGame() {
    // Pause game
    this.physics.pause();
    this.canLaunch = false;

    // Show wallet not ready error
    this.showGameError(
      "Wallet Not Ready",
      "Please ensure your wallet is properly connected to continue."
    );
  }

  /**
   * Cleanup method called when scene shuts down
   */
  shutdown() {
    // Clean up keyboard timer controller
    if (this.keyboardTimerController) {
      this.keyboardTimerController.cleanup();
      this.keyboardTimerController = null;
    }

    // Clean up any remaining timers
    if (this.trajectoryTimer) {
      this.trajectoryTimer.destroy();
      this.trajectoryTimer = null;
    }

    console.log("✅ GameScene shutdown - cleanup completed");
  }
}
