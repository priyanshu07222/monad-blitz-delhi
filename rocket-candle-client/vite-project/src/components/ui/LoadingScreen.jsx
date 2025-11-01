import PropTypes from "prop-types";

const LoadingScreen = ({ message = "Loading...", progress = null }) => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-xl">
      <div className="text-center space-y-lg">
        {/* Animated rocket icon */}
        <div className="relative">
          <div className="text-6xl animate-bounce">🚀</div>
          <div className="absolute inset-0 text-6xl animate-pulse opacity-30">
            🚀
          </div>
        </div>

        {/* Loading message */}
        <h2
          className="text-xl font-semibold animate-pulse"
          style={{ color: "var(--text-primary)" }}
        >
          {message}
        </h2>

        {/* Progress bar if provided */}
        {progress !== null && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-sm">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex justify-center space-x-sm">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  progress: PropTypes.number,
};

export default LoadingScreen;
