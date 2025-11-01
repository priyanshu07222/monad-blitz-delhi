import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

const ToastContext = createContext();

const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration = 5000) => {
      const id = Date.now() + Math.random();
      const toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    showToast,
    hideToast,
    toasts,
    // Convenience methods
    showSuccess: (message, duration) =>
      showToast(message, TOAST_TYPES.SUCCESS, duration),
    showError: (message, duration) =>
      showToast(message, TOAST_TYPES.ERROR, duration),
    showWarning: (message, duration) =>
      showToast(message, TOAST_TYPES.WARNING, duration),
    showInfo: (message, duration) =>
      showToast(message, TOAST_TYPES.INFO, duration),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const { toasts, hideToast } = useContext(ToastContext);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const { message, type } = toast;

  const typeClasses = {
    success: "bg-green-900/90 border-green-500/50 text-green-100",
    error: "bg-red-900/90 border-red-500/50 text-red-100",
    warning: "bg-yellow-900/90 border-yellow-500/50 text-yellow-100",
    info: "bg-blue-900/90 border-blue-500/50 text-blue-100",
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      className={`
      glass-card p-4 rounded-lg shadow-lg max-w-sm border
      animate-slide-in-right transition-all duration-300
      ${typeClasses[type]}
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-sm">{icons[type]}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="transition-colors ml-4"
          style={{
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "var(--text-muted)";
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(TOAST_TYPES)).isRequired,
    duration: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export { ToastProvider, TOAST_TYPES };
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
