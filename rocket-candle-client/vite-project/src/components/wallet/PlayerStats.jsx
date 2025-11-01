import PropTypes from "prop-types";

const PlayerStats = ({ playerScores = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="info-card player-stats">
        <h3>📊 Your Stats</h3>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (!playerScores || playerScores.length === 0) {
    return (
      <div className="info-card player-stats">
        <h3>📊 Your Stats</h3>
        <div className="empty-state">
          <p>No scores yet</p>
          <p>Play to see your stats!</p>
        </div>
      </div>
    );
  }

  const bestScore = Math.max(...playerScores.map((s) => s.score));
  const totalGames = playerScores.length;
  const averageScore = (
    playerScores.reduce((sum, s) => sum + s.score, 0) / totalGames
  ).toFixed(0);

  return (
    <div className="info-card player-stats">
      <h3>📊 Your Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span>Best Score:</span>
          <span className="stat-value">{bestScore.toLocaleString()}</span>
        </div>

        <div className="stat-item">
          <span>Games Played:</span>
          <span className="stat-value">{totalGames}</span>
        </div>

        <div className="stat-item">
          <span>Average Score:</span>
          <span className="stat-value">{averageScore}</span>
        </div>
      </div>
    </div>
  );
};

PlayerStats.propTypes = {
  playerScores: PropTypes.arrayOf(
    PropTypes.shape({
      score: PropTypes.number.isRequired,
      level: PropTypes.number.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
};

export default PlayerStats;
