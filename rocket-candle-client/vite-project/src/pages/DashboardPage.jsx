import { useWalletContext } from "../hooks/useWalletContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import NetworkIndicator from "../components/ui/NetworkIndicator";
import FloatingBackground from "../components/ui/FloatingBackground";

const DashboardPage = () => {
  const {
    address,
    rocketFuelBalance,
    playerScores,
    leaderboardData,
    playerStatsLoading: isLoadingStats,
    leaderboardLoading: isLoadingLeaderboard,
  } = useWalletContext();

  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game");
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <AppLayout>
      <NetworkIndicator />

      {/* Floating background animations */}
      <FloatingBackground />

      <div className="dashboard-container">
        {/* Back button and header */}
        <div className="dashboard-header">
          <button onClick={handleBackToLanding} className="back-button">
            ← Back to Landing
          </button>
          <h1 className="dashboard-title">🚀 Player Dashboard</h1>
        </div>

        <div className="dashboard-section">
          <div className="wallet-connected-info">
            {/* Player Info Card */}
            <div className="info-card">
              <h3>Player Info</h3>
              <div className="info-item">
                <p>Wallet Address</p>
                <p className="mono address-display" title={address}>
                  {formatAddress(address)}
                </p>
              </div>
              <div className="info-item">
                <p>RocketFUEL Balance</p>
                <p>{rocketFuelBalance || 0} RocketFUEL</p>
              </div>
            </div>

            {/* Game Stats Card */}
            <div className="info-card">
              <h3>Game Statistics</h3>
              {isLoadingStats ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading stats...</p>
                </div>
              ) : (
                <>
                  <div className="info-item">
                    <p>Games Played</p>
                    <p>{playerScores?.results?.length || 0}</p>
                  </div>
                  <div className="info-item">
                    <p>Best Score</p>
                    <p>
                      {playerScores?.results?.length > 0
                        ? Math.max(...playerScores.results.map((s) => s.score))
                        : 0}
                    </p>
                  </div>
                  <div className="info-item">
                    <p>Average Score</p>
                    <p>
                      {playerScores?.results?.length > 0
                        ? Math.round(
                            playerScores.results.reduce(
                              (sum, s) => sum + s.score,
                              0
                            ) / playerScores.results.length
                          )
                        : 0}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="info-card">
              <h3>Quick Actions</h3>
              <button
                onClick={handleStartGame}
                className="btn btn-primary btn-large"
              >
                🚀 Start New Game
              </button>
            </div>
          </div>

          {/* Games and Leaderboard Section - Side by Side */}
          <div className="dashboard-games-section">
            {/* Game History Section */}
            <div className="info-card dashboard-card">
              <h3>Recent Games</h3>
              {isLoadingStats ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading game history...</p>
                </div>
              ) : playerScores?.results?.length > 0 ? (
                <div className="leaderboard-container">
                  {playerScores.results.slice(0, 5).map((game, index) => (
                    <div key={index} className="leaderboard-item">
                      <div className="leaderboard-info">
                        <span>
                          {new Date(game.timestamp * 1000).toLocaleDateString()}
                        </span>
                        <span className="leaderboard-score">{game.score}</span>
                        <span>
                          {game.period === "final-game-complete"
                            ? "Complete"
                            : game.period === "final-game-failed"
                            ? "Failed"
                            : game.period || "N/A"}
                        </span>
                        <span className="success-glow">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No games played yet</p>
                  <button onClick={handleStartGame} className="btn btn-success">
                    Play Your First Game
                  </button>
                </div>
              )}
            </div>

            {/* Global Leaderboard Section */}
            <div className="info-card dashboard-card">
              <h3>Global Leaderboard</h3>
              {isLoadingLeaderboard ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading leaderboard...</p>
                </div>
              ) : leaderboardData?.length > 0 ? (
                <div className="leaderboard-container">
                  {leaderboardData.map((entry, index) => (
                    <div
                      key={index}
                      className={`leaderboard-item ${
                        entry.player === address ? "success-glow" : ""
                      }`}
                    >
                      <div className="leaderboard-rank">#{index + 1}</div>
                      <div className="leaderboard-info">
                        <span className="leaderboard-address mono">
                          {entry.player === address
                            ? "You"
                            : formatAddress(entry.player)}
                        </span>
                        <span className="leaderboard-score">{entry.score}</span>
                        <span>
                          {entry.period === "final-game-complete"
                            ? "Complete"
                            : entry.period === "final-game-failed"
                            ? "Failed"
                            : entry.period || "N/A"}
                        </span>
                        <span>
                          {new Date(
                            entry.timestamp * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No leaderboard data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
