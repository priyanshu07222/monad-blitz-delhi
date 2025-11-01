import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "w-8 h-8", className = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-xl min-h-[120px]">
      <div
        className={`${size} border-3 border-glass-border border-t-primary-purple
        rounded-full animate-spin mb-md ${className}`}
      ></div>
      <p className="text-text-secondary">Loading...</p>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;
