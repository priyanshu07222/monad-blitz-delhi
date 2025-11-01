import { useState, useEffect, useCallback } from "react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { web3Service } from "../services/Web3Service.js";
import { monadTestnet } from "../config/wagmiConfig.js";

const MONAD_CHAIN_ID = monadTestnet.id;

export const useWallet = () => {
  const {
    address,
    chainId: accountChainId,
    isConnected,
    isConnecting,
    isReconnecting,
  } = useAccount();
  const {
    disconnectAsync,
    isPending: isDisconnecting,
  } = useDisconnect();
  const {
    switchChainAsync,
    isPending: isSwitching,
  } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const [rocketFuelBalance, setRocketFuelBalance] = useState(0);
  const [error, setError] = useState(null);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  const currentChainId = accountChainId ?? null;
  const isCorrectNetwork = currentChainId === MONAD_CHAIN_ID;
  const isReadyForGame = isConnected && isCorrectNetwork;

  const refreshBalance = useCallback(async () => {
    if (!isConnected || !address) {
      setRocketFuelBalance(0);
      return;
    }

    setIsRefreshingBalance(true);
    try {
      const balance = await web3Service.getFuelBalance(address);
      setRocketFuelBalance(balance || 0);
    } catch (err) {
      console.error("Failed to refresh balance:", err);
      setError(err?.message || "Failed to refresh balance");
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && address) {
      web3Service.setWallet(address);
      refreshBalance();
    } else {
      web3Service.setWallet(null);
      setRocketFuelBalance(0);
    }
  }, [isConnected, address, refreshBalance]);

  const connectWallet = useCallback(() => {
    setError(null);
    if (openConnectModal) {
      openConnectModal();
    } else {
      console.warn("RainbowKit connect modal is not available.");
    }
  }, [openConnectModal]);

  const switchNetwork = useCallback(async () => {
    if (!switchChainAsync) {
      setError("Switch network is not available for this wallet");
      return;
    }

    try {
      setError(null);
      await switchChainAsync({ chainId: MONAD_CHAIN_ID });
    } catch (err) {
      console.error("Network switch failed:", err);
      setError(err?.message || "Failed to switch network");
      throw err;
    }
  }, [switchChainAsync]);

  const disconnect = useCallback(async () => {
    try {
      setError(null);
      await disconnectAsync();
      setRocketFuelBalance(0);
    } catch (err) {
      console.error("Failed to disconnect:", err);
      setError(err?.message || "Failed to disconnect");
      throw err;
    }
  }, [disconnectAsync]);

  const resetConnectionState = useCallback(() => {
    setError(null);
  }, []);

  return {
    isConnected,
    address,
    rocketFuelBalance,
    isCorrectNetwork,
    isConnecting: isConnecting || isReconnecting,
    isSwitching,
    isDisconnecting,
    isRefreshingBalance,
    error,
    connectWallet,
    switchNetwork,
    disconnect,
    resetConnectionState,
    refreshBalance,
    shortAddress: address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : null,
    isReadyForGame,
    currentChainId,
  };
};
