import PropTypes from "prop-types";

const GradientText = ({
  children,
  className = "",
  animated = true,
  size = "text-5xl",
}) => {
  const baseClasses = `font-bold text-gradient leading-tight tracking-tight ${size}`;
  const animatedClasses = animated ? "animate-gradient-shift" : "";

  return (
    <h1 className={`${baseClasses} ${animatedClasses} ${className}`}>
      {children}
    </h1>
  );
};

GradientText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animated: PropTypes.bool,
  size: PropTypes.string,
};

export default GradientText;
