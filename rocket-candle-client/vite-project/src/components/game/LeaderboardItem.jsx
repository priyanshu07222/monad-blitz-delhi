import { memo } from "react";
import PropTypes from "prop-types";

const LeaderboardItem = ({ rank, address, score, isCurrentPlayer = false }) => {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div
      className={`leaderboard-item ${isCurrentPlayer ? "current-player" : ""}`}
    >
      <div className="leaderboard-info">
        <span className="leaderboard-rank">#{rank}</span>
        <span className="leaderboard-address mono">
          {shortAddress}
          {isCurrentPlayer ? " (You)" : ""}
        </span>
      </div>
      <span className="leaderboard-score">{score.toLocaleString()}</span>
    </div>
  );
};

LeaderboardItem.propTypes = {
  rank: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  isCurrentPlayer: PropTypes.bool,
};

export default memo(LeaderboardItem);
