import PropTypes from "prop-types";
import WalletStatus from "./WalletStatus";
import PlayerStats from "./PlayerStats";

const Dashboard = ({
  address,
  rocketFuelBalance,
  playerScores,
  onStartGame,
  isLoadingStats = false,
  isLoadingBalance = false,
  gameEnabled = true,
  children, // For leaderboard component
}) => {
  return (
    <div className="dashboard-section">
      <button
        onClick={onStartGame}
        disabled={!gameEnabled}
        className="play-button"
      >
        🚀 Start Playing
      </button>

      {/* Game container for Phaser */}
      <div id="game-container" className="game-container"></div>

      <div className="wallet-connected-info">
        <WalletStatus
          address={address}
          rocketFuelBalance={rocketFuelBalance}
          isLoading={isLoadingBalance}
        />

        {children}

        <PlayerStats playerScores={playerScores} isLoading={isLoadingStats} />
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  address: PropTypes.string,
  rocketFuelBalance: PropTypes.number,
  playerScores: PropTypes.array,
  onStartGame: PropTypes.func.isRequired,
  isLoadingStats: PropTypes.bool,
  isLoadingBalance: PropTypes.bool,
  gameEnabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Dashboard;
