import PropTypes from "prop-types";

const MonadLogo = ({ className = "" }) => {
  return <div className={`monad-logo ${className}`}>M</div>;
};

MonadLogo.propTypes = {
  className: PropTypes.string,
};

export default MonadLogo;
