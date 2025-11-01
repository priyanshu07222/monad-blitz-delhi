import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../../hooks/useWalletContext";

const ProtectedRoute = ({ children }) => {
  const { isConnected, isCorrectNetwork, address } = useWalletContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page if wallet requirements are not met
    if (!isConnected || !isCorrectNetwork || !address) {
      navigate("/", { replace: true });
    }
  }, [isConnected, isCorrectNetwork, address, navigate]);

  // Don't render children if wallet requirements are not met
  if (!isConnected || !isCorrectNetwork || !address) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 50%, var(--bg-quaternary) 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "var(--text-primary)" }}
          ></div>
          <p className="text-lg" style={{ color: "var(--text-primary)" }}>
            Checking wallet connection...
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            Redirecting to landing page
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
