import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import RocketFuelRewardNotification from "./RocketFuelRewardNotification";

const GameNotification = ({ notifications, onRemove }) => {
  return (
    <div className="game-notifications-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // Wait for fade out animation
  }, [onRemove, notification.id]);

  useEffect(() => {
    // Auto-remove after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, handleRemove]);

  // Handle special RocketFuel reward notification
  if (notification.type === "rocketfuel-reward") {
    return (
      <RocketFuelRewardNotification
        totalReward={notification.totalReward}
        breakdown={notification.breakdown}
        txHash={notification.txHash}
        onClose={() => onRemove(notification.id)}
      />
    );
  }

  const getTypeStyles = () => {
    const baseStyles = "notification-item";
    switch (notification.type) {
      case "success":
        return `${baseStyles} notification-success`;
      case "error":
        return `${baseStyles} notification-error`;
      case "warning":
        return `${baseStyles} notification-warning`;
      case "info":
      default:
        return `${baseStyles} notification-info`;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`${getTypeStyles()} ${
        isVisible && !isRemoving ? "visible" : ""
      } ${isRemoving ? "removing" : ""}`}
    >
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{notification.message}</span>
      </div>

      {notification.actions && notification.actions.length > 0 && (
        <div className="notification-actions">
          {notification.actions.map((action, index) => (
            <button
              key={index}
              className={`notification-btn ${action.type || "primary"}`}
              onClick={() => {
                action.onClick();
                if (action.autoClose !== false) {
                  handleRemove();
                }
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <button
        className="notification-close"
        onClick={handleRemove}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

GameNotification.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        "success",
        "error",
        "warning",
        "info",
        "rocketfuel-reward",
      ]),
      duration: PropTypes.number, // in milliseconds, 0 or null means no auto-remove
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          onClick: PropTypes.func.isRequired,
          type: PropTypes.oneOf(["primary", "secondary", "danger"]),
          autoClose: PropTypes.bool, // defaults to true
        })
      ),
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default GameNotification;
