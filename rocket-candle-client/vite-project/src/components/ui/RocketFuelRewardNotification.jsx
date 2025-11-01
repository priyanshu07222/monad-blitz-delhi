import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const RocketFuelRewardNotification = ({
  totalReward,
  breakdown,
  onClose,
  txHash = null,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Start coin animation after component is visible
    if (isVisible) {
      const animationTimer = setTimeout(() => setIsAnimating(true), 500);
      return () => clearTimeout(animationTimer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleViewTransaction = () => {
    if (txHash) {
      window.open(`https://monad-explorer.xyz/tx/${txHash}`, "_blank");
    }
  };

  return (
    <div
      className={`rocketfuel-reward-notification ${isVisible ? "visible" : ""}`}
    >
      <div className="reward-header">
        <div className="reward-icon-container">
          <span className={`reward-icon ${isAnimating ? "animate" : ""}`}>
            🪙
          </span>
          <div className="coin-particles">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className={`coin-particle ${isAnimating ? "animate" : ""}`}
                style={{
                  "--delay": `${i * 0.1}s`,
                  "--rotation": `${i * 60}deg`,
                }}
              >
                ✨
              </span>
            ))}
          </div>
        </div>
        <div className="reward-content">
          <h3 className="reward-title">RocketFUEL Earned!</h3>
          <div className="reward-amount">{totalReward} FUEL</div>
        </div>
        <button className="reward-close" onClick={handleClose}>
          ×
        </button>
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="reward-breakdown">
          <h4>Reward Breakdown:</h4>
          <ul>
            {breakdown.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="reward-actions">
        <div className="reward-info">
          <span className="info-icon">💰</span>
          <span>Tokens will be minted to your wallet</span>
        </div>

        <div className="reward-buttons">
          {txHash && (
            <button
              className="reward-btn primary"
              onClick={handleViewTransaction}
            >
              View Transaction
            </button>
          )}
          <button className="reward-btn secondary" onClick={handleClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

RocketFuelRewardNotification.propTypes = {
  totalReward: PropTypes.number.isRequired,
  breakdown: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func.isRequired,
  txHash: PropTypes.string,
};

export default RocketFuelRewardNotification;
