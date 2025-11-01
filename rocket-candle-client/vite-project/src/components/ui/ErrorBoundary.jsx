import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    //console.log("Error caught:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and store error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-xl">
          <div className="glass-morphism max-w-2xl w-full p-xl text-center rounded-xl border border-glass-border backdrop-blur-xl">
            <div
              className="text-4xl mb-lg"
              style={{ color: "var(--error-red)" }}
            >
              ⚠️
            </div>
            <h1
              className="text-2xl font-bold mb-md"
              style={{ color: "var(--text-primary)" }}
            >
              Oops! Something went wrong
            </h1>
            <p className="mb-lg" style={{ color: "var(--text-secondary)" }}>
              The application encountered an unexpected error. Please try
              refreshing the page.
            </p>

            <div className="space-y-md">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-purple hover:bg-primary-purple-dark px-lg py-md rounded-lg transition-colors mr-md"
                style={{ color: "var(--text-on-dark)" }}
              >
                Refresh Page
              </button>

              <button
                onClick={() =>
                  this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                  })
                }
                className="px-lg py-md rounded-lg transition-colors"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-on-dark)",
                  border: "1px solid var(--glass-border)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "var(--bg-secondary)";
                }}
              >
                Try Again
              </button>
            </div>

            {/* Error details for development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-lg text-left">
                <summary
                  className="cursor-pointer mb-md"
                  style={{ color: "var(--text-muted)" }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  className="p-md rounded text-xs overflow-auto max-h-60"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--error-red)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
