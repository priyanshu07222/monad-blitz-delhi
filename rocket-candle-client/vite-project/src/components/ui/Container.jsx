import PropTypes from "prop-types";

const Container = ({ children, className = "", maxWidth = "max-w-7xl" }) => {
  return (
    <div className={`${maxWidth} mx-auto px-xl ${className}`}>{children}</div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.string,
};

export default Container;
