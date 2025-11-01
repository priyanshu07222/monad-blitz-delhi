import PropTypes from "prop-types";

const AppLayout = ({ children }) => {
  return <div className="app">{children}</div>;
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
