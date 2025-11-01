import { useState, useCallback } from "react";

/**
 * Custom hook for managing loading states
 * @param {boolean} initialLoading - Initial loading state
 * @returns {Object} - Loading state management functions
 */
export const useLoadingState = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
    if (loading) {
      setError(null); // Clear error when starting new operation
    }
  }, []);

  const setLoadingError = useCallback((errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  /**
   * Execute an async function with loading state management
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Options for execution
   * @returns {Promise} - Promise that resolves/rejects based on asyncFn
   */
  const withLoading = useCallback(
    async (asyncFn, options = {}) => {
      const { onSuccess, onError, clearErrorOnStart = true } = options;

      try {
        setLoading(true);
        if (clearErrorOnStart) {
          clearError();
        }

        const result = await asyncFn();

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err.message || "An error occurred";
        setLoadingError(errorMessage);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setLoadingError, clearError]
  );

  return {
    isLoading,
    error,
    setLoading,
    setLoadingError,
    clearError,
    reset,
    withLoading,
  };
};

export default useLoadingState;
