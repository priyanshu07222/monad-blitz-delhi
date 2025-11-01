import { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import LoadingButton from "../ui/LoadingButton";
import LoadingScreen from "../ui/LoadingScreen";
import { useGameState } from "../../hooks/useGameState";

// Lazy load the GameContainer to improve initial bundle size
const GameContainer = lazy(() => import("./GameContainer"));

const GameLauncher = ({
  isReadyForGame,
  onStartGame,
  isConnected,
  rocketFuelBalance,
}) => {
  const {
    gameActive,
    gameLoading,
    gameScore,
    highScore,
    startGame,
    endGame,
    canStart,
  } = useGameState();

  const handleLaunchGame = async () => {
    if (!isReadyForGame || !canStart) return;
    await startGame(onStartGame);
  };

  const handleGameEnd = (score) => {
    endGame(score);
  };

  const handleGameStart = () => {
    //console.log("Game started");
  };

  const handleExitGame = () => {
    endGame(gameScore);
  };

  if (gameActive) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="relative w-full h-full max-w-6xl max-h-4xl">
          <button
            onClick={handleExitGame}
            className="absolute top-4 right-4 z-10 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--error-red)",
              color: "var(--text-on-dark)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--error-red)";
            }}
          >
            Exit Game
          </button>
          <Suspense fallback={<LoadingScreen message="Loading game..." />}>
            <GameContainer
              onGameEnd={handleGameEnd}
              onGameStart={handleGameStart}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-md">
      <div className="glass-card p-lg rounded-2xl">
        <h3
          className="text-xl font-bold mb-md"
          style={{ color: "var(--text-primary)" }}
        >
          Ready to Launch Rocket Candle?
        </h3>

        <div
          className="space-y-sm text-sm mb-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          <p>Fuel Balance: {rocketFuelBalance} FUEL</p>
          <p>Status: {isConnected ? "Connected" : "Not Connected"}</p>
          {highScore > 0 && <p>High Score: {highScore.toLocaleString()}</p>}
        </div>

        <LoadingButton
          onClick={handleLaunchGame}
          loading={gameLoading}
          disabled={!isReadyForGame || !canStart}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
        >
          {gameLoading ? "Launching..." : "Launch Game"}
        </LoadingButton>

        {!isReadyForGame && (
          <p className="text-sm mt-sm" style={{ color: "var(--error-red)" }}>
            {!isConnected
              ? "Connect your wallet to play"
              : "Switch to correct network to play"}
          </p>
        )}
      </div>
    </div>
  );
};

GameLauncher.propTypes = {
  isReadyForGame: PropTypes.bool.isRequired,
  onStartGame: PropTypes.func.isRequired,
  isConnected: PropTypes.bool.isRequired,
  rocketFuelBalance: PropTypes.number.isRequired,
};

export default GameLauncher;
