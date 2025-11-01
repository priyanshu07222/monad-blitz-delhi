import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { WalletProvider } from "./context/WalletContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import "./App.css"; //

// Lazy load components for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const GameEndPage = lazy(() => import("./pages/GameEndPage"));

// Loading component
const PageLoader = () => (
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
        Loading...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/game"
                  element={
                    <ProtectedRoute>
                      <GamePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/game/end"
                  element={
                    <ProtectedRoute>
                      <GameEndPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
