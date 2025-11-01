import PropTypes from "prop-types";

const AnimatedCard = ({
  children,
  className = "",
  hover = true,
  delay = 0,
}) => {
  const hoverClasses = hover
    ? `
    hover:-translate-y-2 hover:glass-morphism-hover hover:border-glass-border-hover
    hover:shadow-2xl group
  `
    : "";

  const animationDelay = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return (
    <div
      className={`
        glass-morphism p-xl rounded-3xl backdrop-blur-2xl border border-glass-border
        transition-all duration-500 relative overflow-hidden min-h-[280px]
        flex flex-col items-center text-center animate-fade-in-up ${hoverClasses} ${className}
      `}
      style={animationDelay}
    >
      {/* Animated border effect */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
        from-transparent via-white/40 to-transparent transform -translate-x-full
        group-hover:translate-x-full transition-transform duration-700"
      ></div>

      {children}
    </div>
  );
};

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  delay: PropTypes.number,
};

export default AnimatedCard;
