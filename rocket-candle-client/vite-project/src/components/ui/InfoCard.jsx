import PropTypes from "prop-types";

const InfoCard = ({ children, className = "", title, icon, hover = true }) => {
  const hoverClasses = hover
    ? "hover:glass-morphism-hover hover:-translate-y-1"
    : "";

  return (
    <div
      className={`
      p-xl glass-morphism rounded-xl border border-glass-border
      transition-all duration-300 ${hoverClasses} ${className}
    `}
    >
      {title && (
        <h3
          className="text-xl font-bold mb-lg text-text-primary text-center
          font-inter flex items-center justify-center space-x-2"
        >
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </h3>
      )}
      {children}
    </div>
  );
};

InfoCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  hover: PropTypes.bool,
};

export default InfoCard;
