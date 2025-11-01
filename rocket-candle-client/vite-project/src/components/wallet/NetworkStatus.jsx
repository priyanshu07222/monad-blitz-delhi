import PropTypes from "prop-types";
import LoadingButton from "../ui/LoadingButton";

const NetworkStatus = ({
  isVisible = false,
  onSwitchNetwork,
  isSwitching = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className="network-status">
      <div className="network-warning">
        <h4>⚠️ Wrong Network Detected</h4>
        <p>
          Please switch to <strong>Monad Testnet</strong> to continue
        </p>
        <button
          onClick={onSwitchNetwork}
          disabled={isSwitching}
          className="switch-network-btn"
        >
          🔄 Switch to Monad Testnet
        </button>
      </div>
    </div>
  );
};

NetworkStatus.propTypes = {
  isVisible: PropTypes.bool,
  onSwitchNetwork: PropTypes.func.isRequired,
  isSwitching: PropTypes.bool,
};

export default NetworkStatus;
