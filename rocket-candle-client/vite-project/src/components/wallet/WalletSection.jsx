import PropTypes from "prop-types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NetworkStatus from "./NetworkStatus";
import WalletInfo from "./WalletInfo";

const WalletSection = ({
  onSwitchNetwork,
  onDashboard,
  onStartGame,
  isSwitching = false,
  isConnected = false,
  isCorrectNetwork = false,
  showNetworkError = false,
}) => {
  return (
    <div className="wallet-section">
      {/* Show connect button if not connected */}
      <div className="wallet-connect-button">
        <ConnectButton
          label={isConnected ? "Manage Wallet" : "Connect Wallet"}
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          chainStatus="icon"
          showBalance={false}
        />
      </div>

      {/* Show navigation buttons if connected and on correct network */}
      {isConnected && isCorrectNetwork && (
        <div className="navigation-buttons">
          <button onClick={onDashboard} className="btn btn-primary btn-large">
            📊 Go to Dashboard
          </button>
          <button onClick={onStartGame} className="btn btn-success btn-large">
            🚀 Start Game
          </button>
        </div>
      )}

      <NetworkStatus
        isVisible={showNetworkError}
        onSwitchNetwork={onSwitchNetwork}
        isSwitching={isSwitching}
      />

      <WalletInfo />
    </div>
  );
};

WalletSection.propTypes = {
  onSwitchNetwork: PropTypes.func.isRequired,
  onDashboard: PropTypes.func.isRequired,
  onStartGame: PropTypes.func.isRequired,
  isSwitching: PropTypes.bool,
  isConnected: PropTypes.bool,
  isCorrectNetwork: PropTypes.bool,
  showNetworkError: PropTypes.bool,
};

export default WalletSection;
