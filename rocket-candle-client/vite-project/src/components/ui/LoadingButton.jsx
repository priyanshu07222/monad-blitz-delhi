import PropTypes from "prop-types";

const LoadingButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseClasses = `
    px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
    transform hover:scale-105 active:scale-95 disabled:opacity-60
    disabled:cursor-not-allowed disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-success-green to-success-green-dark
      hover:from-success-green-dark hover:to-success-green-darker
      text-white shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gradient-to-r from-primary-purple to-primary-purple-dark
      hover:from-primary-purple-dark hover:to-primary-purple
      text-white shadow-lg hover:shadow-xl
    `,
    warning: `
      bg-gradient-to-r from-accent-orange to-accent-coral
      hover:from-accent-coral hover:to-accent-orange
      text-white shadow-lg hover:shadow-xl
    `,
  };

  const loadingClasses = loading ? "animate-pulse cursor-wait" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${loadingClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

LoadingButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "warning"]),
  className: PropTypes.string,
};

export default LoadingButton;
