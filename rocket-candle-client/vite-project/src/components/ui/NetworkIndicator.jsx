import { useWalletContext } from "../../hooks/useWalletContext";

const NetworkIndicator = () => {
  const { isConnected, isCorrectNetwork, address, rocketFuelBalance } =
    useWalletContext();

  if (!isConnected) {
    return (
      <div
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 40 }}
      >
        <div
          className="glass-card"
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(153, 27, 27, 0.2)",
            borderColor: "rgba(239, 68, 68, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "rgb(239, 68, 68)",
                borderRadius: "50%",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            ></div>
            <span style={{ fontSize: "0.95rem", color: "rgb(252, 165, 165)" }}>
              Not Connected
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 40 }}
      >
        <div
          className="glass-card"
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(120, 53, 15, 0.2)",
            borderColor: "rgba(245, 158, 11, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "rgb(245, 158, 11)",
                borderRadius: "50%",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", color: "rgb(252, 211, 77)" }}>
              Wrong Network
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 40 }}>
      <div
        className="glass-card"
        style={{
          padding: "0.85rem",
          background: "rgba(20, 83, 45, 0.2)",
          borderColor: "rgba(34, 197, 94, 0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minWidth: "200px",
        }}
      >
        {/* Connection Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "rgb(34, 197, 94)",
              borderRadius: "50%",
            }}
          ></div>
          <span style={{ fontSize: "1rem", color: "rgb(134, 239, 172)" }}>
            Connected
          </span>
          {address && (
            <span
              style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          )}
        </div>

        {/* RocketFUEL Token Balance */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.25rem 0",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
            }}
          >
            {/* <img
              src="/assets/rocket.png"
              alt="RocketFUEL"
              style={{
                width: "16px",
                height: "16px",
                objectFit: "contain",
                imageRendering: "pixelated",
              }}
            /> */}
            <p
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
                imageRendering: "pixelated",
              }}
            >
              🚀
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span
              style={{
                fontSize: "1.2rem",
                color: "rgb(34, 197, 94)",
                fontWeight: "600",
              }}
            >
              RocketFUEL
            </span>
            <span
              style={{
                fontSize: "0.95rem",
                color: "white",
                fontWeight: "700",
                fontFamily: "Inter, monospace",
              }}
            >
              {rocketFuelBalance ? rocketFuelBalance.toLocaleString() : "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkIndicator;
