import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../hooks/useWalletContext";

import AppLayout from "../components/layout/AppLayout";
import FloatingBackground from "../components/ui/FloatingBackground";
import NetworkIndicator from "../components/ui/NetworkIndicator";
import HeroSection from "../components/landing/HeroSection";
import WalletSection from "../components/wallet/WalletSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowToPlaySection from "../components/landing/HowToPlaySection";
import Footer from "../components/layout/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  // Get basic wallet state from context (for connection status)
  const {
    isConnected,
    address,
    isSwitching,
    isCorrectNetwork,
    error: walletError,
    switchNetwork,
  } = useWalletContext();

  // Remove automatic redirect - let users choose where to go
  // useEffect(() => {
  //   if (isConnected && isCorrectNetwork && address) {
  //     navigate("/dashboard", { replace: true });
  //   }
  // }, [isConnected, isCorrectNetwork, address, navigate]);

  // Navigation handlers
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleStartGame = () => {
    navigate("/game");
  };

  return (
    <AppLayout>
      {/* Network Status Indicator */}
      <NetworkIndicator />

      {/* Floating background animations */}
      <FloatingBackground />

      {/* Main content container - using original HTML structure */}
      <div className="landing-container">
        {/* Hero Section */}
        <HeroSection />

        {/* CTA Section - Only show wallet connection */}
        <section className="cta-section">
          {/* Wallet Connection Section */}
          <WalletSection
            onSwitchNetwork={switchNetwork}
            onDashboard={handleDashboard}
            onStartGame={handleStartGame}
            isSwitching={isSwitching}
            isConnected={isConnected}
            isCorrectNetwork={isCorrectNetwork}
            showNetworkError={address && !isCorrectNetwork}
          />
        </section>

        {/* Content Section */}
        <section className="content-section">
          {/* Features Section */}
          <FeaturesSection />

          {/* How to Play Section */}
          <HowToPlaySection />
        </section>

        {/* Footer */}
        <Footer />

        {/* Error Display */}
        {walletError && (
          <div className="error-toast">
            <p>{walletError}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default LandingPage;
