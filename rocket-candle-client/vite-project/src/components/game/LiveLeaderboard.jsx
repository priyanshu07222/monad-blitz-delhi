import { useWalletContext } from "../../hooks/useWalletContext";

const LiveLeaderboard = () => {
  const {
    leaderboardData,
    leaderboardLoading: isLoading,
    address,
  } = useWalletContext();

  if (isLoading) {
    return (
      <div className="info-card">
        <h3>🏆 Live Leaderboard</h3>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="info-card">
        <h3>🏆 Live Leaderboard</h3>
        <div className="empty-state">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  // Show top 5 players
  const topPlayers = leaderboardData.slice(0, 5);

  return (
    <div className="info-card">
      <h3>🏆 Live Leaderboard</h3>
      <div className="leaderboard-container">
        {topPlayers.map((player, index) => (
          <div
            key={index}
            className={`leaderboard-item ${
              player.player === address ? "success-glow" : ""
            }`}
          >
            <div className="leaderboard-rank">#{index + 1}</div>
            <div className="leaderboard-info">
              <span className="leaderboard-address mono">
                {player.player === address
                  ? "You"
                  : `${player.player.slice(0, 4)}...${player.player.slice(-3)}`}
              </span>
              <span className="leaderboard-score">
                {player.score.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "var(--space-md)",
          paddingTop: "var(--space-sm)",
          borderTop: "1px solid var(--glass-border)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "var(--font-size-xs)",
          }}
        >
          Compete to reach the top!
        </p>
      </div>
    </div>
  );
};

export default LiveLeaderboard;
