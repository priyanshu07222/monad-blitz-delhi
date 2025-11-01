import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWalletContext } from "../hooks/useWalletContext";
import AppLayout from "../components/layout/AppLayout";
import NetworkIndicator from "../components/ui/NetworkIndicator";

const GameEndPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, leaderboardData } = useWalletContext();

  // Get game results from navigation state
  const gameResults = location.state || {
    score: 0,
    level: 1,
    completed: false,
    totalTime: 0,
  };

  const [playerRank, setPlayerRank] = useState(null);

  // Calculate player rank based on current score
  useEffect(() => {
    if (leaderboardData && gameResults.score > 0) {
      const sortedLeaderboard = [...leaderboardData].sort(
        (a, b) => b.score - a.score
      );
      const rank =
        sortedLeaderboard.findIndex(
          (entry) => entry.score <= gameResults.score
        ) + 1;
      setPlayerRank(rank || leaderboardData.length + 1);
    }
  }, [leaderboardData, gameResults.score]);

  const handlePlayAgain = () => {
    navigate("/game");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleViewLeaderboard = () => {
    navigate("/dashboard", { state: { scrollToLeaderboard: true } });
  };

  return (
    <AppLayout>
      <NetworkIndicator />

      <div className="dashboard-section">
        <div
          className="info-card"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          {/* Status Header */}
          <div
            style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}
          >
            {gameResults.completed ? (
              <div className="success-glow">
                <h1>🎉 Mission Accomplished!</h1>
                <p>You successfully completed the level</p>
              </div>
            ) : (
              <div>
                <h1>⚠️ Mission Incomplete</h1>
                <p>Better luck next time, space explorer!</p>
              </div>
            )}
          </div>

          {/* Score Display */}
          <div
            className="stats-grid"
            style={{ marginBottom: "var(--space-xl)" }}
          >
            <div className="stat-item">
              <p>Final Score</p>
              <div className="stat-value">
                {gameResults.score.toLocaleString()}
              </div>
            </div>
            <div className="stat-item">
              <p>Level Reached</p>
              <div className="stat-value">{gameResults.level}</div>
            </div>
            <div className="stat-item">
              <p>Time Played</p>
              <div className="stat-value">
                {Math.floor(gameResults.totalTime / 60)}:
                {(gameResults.totalTime % 60).toString().padStart(2, "0")}
              </div>
            </div>
            <div className="stat-item">
              <p>Global Rank</p>
              <div className="stat-value">
                {playerRank ? `#${playerRank}` : "-"}
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div
            className="info-card"
            style={{ marginBottom: "var(--space-xl)" }}
          >
            <h3>Performance Analysis</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-lg)",
              }}
            >
              <div>
                <h4
                  style={{
                    color: "var(--success-green)",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  Achievements
                </h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {gameResults.score > 1000 && (
                    <li>✅ Score over 1,000 points</li>
                  )}
                  {gameResults.level > 1 && <li>✅ Advanced past level 1</li>}
                  {gameResults.completed && <li>✅ Completed the mission</li>}
                  {gameResults.totalTime < 300 && (
                    <li>✅ Speedrun bonus (under 5 min)</li>
                  )}
                </ul>
              </div>
              <div>
                <h4
                  style={{
                    color: "var(--accent-orange)",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  Areas for Improvement
                </h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {gameResults.score < 500 && (
                    <li>⚡ Practice precision aiming</li>
                  )}
                  {!gameResults.completed && (
                    <li>⚡ Focus on completing levels</li>
                  )}
                  {gameResults.level === 1 && (
                    <li>⚡ Try to advance further</li>
                  )}
                  <li>⚡ Study market patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-md)",
              marginBottom: "var(--space-xl)",
            }}
          >
            <button onClick={handlePlayAgain} className="btn btn-primary">
              🚀 Play Again
            </button>
            <button
              onClick={handleViewLeaderboard}
              className="btn btn-secondary"
            >
              📊 View Leaderboard
            </button>
            <button onClick={handleBackToDashboard} className="btn btn-success">
              📈 Dashboard
            </button>
          </div>

          {/* Player Info */}
          <div
            style={{
              textAlign: "center",
              paddingTop: "var(--space-lg)",
              borderTop: "1px solid var(--glass-border)",
            }}
          >
            <p className="mono">
              Player: {address?.slice(0, 8)}...{address?.slice(-6)}
            </p>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-xs)",
              }}
            >
              Game completed on {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GameEndPage;
