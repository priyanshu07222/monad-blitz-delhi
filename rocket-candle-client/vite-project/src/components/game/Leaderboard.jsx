import PropTypes from "prop-types";
import LeaderboardItem from "./LeaderboardItem";

const Leaderboard = ({
  leaderboardData = [],
  currentPlayerAddress,
  isLoading = false,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      );
    }

    if (!leaderboardData || leaderboardData.length === 0) {
      return (
        <div className="empty-state">
          <p>No scores available</p>
          <p>Play to be the first!</p>
        </div>
      );
    }

    const topEntries = leaderboardData.slice(0, 10);

    return (
      <div className="leaderboard-container">
        {topEntries.map((entry, index) => (
          <LeaderboardItem
            key={`${entry.player}-${entry.score}`}
            rank={index + 1}
            address={entry.player}
            score={entry.score}
            isCurrentPlayer={
              currentPlayerAddress &&
              entry.player.toLowerCase() === currentPlayerAddress.toLowerCase()
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="info-card leaderboard-container">
      <h3>🏆 Leaderboard</h3>
      {renderContent()}
    </div>
  );
};

Leaderboard.propTypes = {
  leaderboardData: PropTypes.arrayOf(
    PropTypes.shape({
      player: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ),
  currentPlayerAddress: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Leaderboard;
