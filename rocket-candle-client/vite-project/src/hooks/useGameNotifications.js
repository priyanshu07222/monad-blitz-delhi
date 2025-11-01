import { useState, useCallback } from "react";

let notificationId = 0;

const useGameNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = ++notificationId;
    const newNotification = {
      id,
      duration: 5000, // Default 5 seconds
      type: "info",
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different types
  const showSuccess = useCallback(
    (message, options = {}) => {
      return addNotification({
        message,
        type: "success",
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, options = {}) => {
      return addNotification({
        message,
        type: "error",
        duration: 8000, // Errors stay longer
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return addNotification({
        message,
        type: "warning",
        duration: 6000,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return addNotification({
        message,
        type: "info",
        ...options,
      });
    },
    [addNotification]
  );

  // Blockchain-specific notifications
  const showBlockchainSuccess = useCallback(
    (message, txHash = null) => {
      const actions = [];

      if (txHash) {
        actions.push({
          label: "View Transaction",
          onClick: () => {
            window.open(`https://monad-explorer.xyz/tx/${txHash}`, "_blank");
          },
          type: "primary",
          autoClose: false,
        });
      }

      // Add wallet action for token rewards
      if (message.includes("RocketFUEL") || message.includes("FUEL")) {
        actions.push({
          label: "Check Wallet",
          onClick: () => {
            // This could open a wallet view or refresh balance
            //console.log("Opening wallet view...");
          },
          type: "secondary",
          autoClose: false,
        });
      }

      return showSuccess(message, {
        duration: 15000, // Blockchain rewards stay longer
        actions,
      });
    },
    [showSuccess]
  );

  const showBlockchainError = useCallback(
    (message, retryAction = null) => {
      const actions = retryAction
        ? [
            {
              label: "Retry",
              onClick: retryAction,
              type: "primary",
              autoClose: true,
            },
          ]
        : [];

      return showError(message, {
        duration: 0, // Don't auto-remove errors with actions
        actions,
      });
    },
    [showError]
  );

  // Special RocketFUEL reward notification
  const showRocketFuelReward = useCallback(
    (totalReward, breakdown = [], txHash = null) => {
      return addNotification({
        type: "rocketfuel-reward",
        totalReward,
        breakdown,
        txHash,
        duration: 0, // Manual dismiss only
        message: `You earned ${totalReward} RocketFUEL tokens!`, // Fallback message
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBlockchainSuccess,
    showBlockchainError,
    showRocketFuelReward,
  };
};

export default useGameNotifications;
