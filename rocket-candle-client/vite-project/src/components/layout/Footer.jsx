import PropTypes from "prop-types";

const Footer = () => {
  return (
    <footer className="footer">
      <p>Developed at Monad Blitz 💜</p>
      <p>
        <a
          href="https://github.com/ironicdegawd"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/ironicdegawd
        </a>
      </p>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
