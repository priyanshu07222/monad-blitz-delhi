import PropTypes from "prop-types";

const WalletStatus = ({
  address,
  rocketFuelBalance = 0,
  isLoading = false,
}) => {
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Loading...";

  return (
    <div className="info-card wallet-status">
      <h3>🔗 Wallet Connected</h3>
      <p>Address: {shortAddress}</p>
      <p>
        RocketFUEL Balance:{" "}
        {isLoading ? "Loading..." : rocketFuelBalance.toLocaleString()}
      </p>
      <p className="network-info network-correct">Network: Monad Testnet ✅</p>
    </div>
  );
};

WalletStatus.propTypes = {
  address: PropTypes.string,
  rocketFuelBalance: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default WalletStatus;
