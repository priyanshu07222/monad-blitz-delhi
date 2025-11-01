import PropTypes from "prop-types";

const Section = ({ children, className = "", spacing = "py-3xl" }) => {
  return <section className={`${spacing} ${className}`}>{children}</section>;
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  spacing: PropTypes.string,
};

export default Section;
