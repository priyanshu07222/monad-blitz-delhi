import { web3Service } from "../services/Web3Service.js";

// Monad Testnet Configuration
const MONAD_TESTNET = {
  chainId: 10143,
  chainIdHex: "0x279F", // 10143 in hex
  name: "Monad Testnet",
  rpcUrl: "https://testnet-rpc.monad.xyz/",
  explorerUrl: "https://testnet.monadexplorer.com/",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
};

export class WalletManager {
  constructor() {
    this.isConnected = false;
    this.address = null;
    this.fuelBalance = 0;
    this.onConnectionChange = null;
    this.onNetworkChange = null;
    this.isCorrectNetwork = false;
    this.currentChainId = null;

    // Check if Web3 is available
    this.isWeb3Available = typeof window !== "undefined" && window.ethereum;

    if (this.isWeb3Available) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
        this.handleAccountsChanged(accounts);
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", (chainId) => {
        console.log("Chain changed:", chainId);
        this.handleChainChanged(chainId);
      });

      // Listen for connection
      window.ethereum.on("connect", (connectInfo) => {
        console.log("Wallet connected:", connectInfo);
      });

      // Listen for disconnection
      window.ethereum.on("disconnect", (error) => {
        console.log("Wallet disconnected:", error);
        this.handleDisconnect();
      });
    }
  }

  async connectWallet() {
    if (!this.isWeb3Available) {
      throw new Error(
        "Web3 wallet not available. Please install MetaMask or another Web3 wallet."
      );
    }

    try {
      console.log("🔄 Starting wallet connection process...");

      // Step 1: First check current network without requesting accounts
      let networkValid = false;
      try {
        networkValid = await this.validateNetwork();
        console.log("Network validation result:", networkValid);
      } catch (error) {
        console.log("Initial network check failed, will try to switch");
      }

      // Step 2: If network is wrong, try to switch before requesting accounts
      if (!networkValid) {
        console.log(
          "🔄 Wrong network detected, switching before account request..."
        );
        const switched = await this.switchToMonadNetwork();
        if (!switched) {
          throw new Error(
            `Please switch to ${MONAD_TESTNET.name} (Chain ID: ${MONAD_TESTNET.chainId}) before connecting.`
          );
        }
        // Validate network again after switch
        networkValid = await this.validateNetwork();
      }

      // Step 3: Now request accounts on the correct network
      console.log("🔄 Requesting account access on Monad Testnet...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        await this.handleConnection(accounts[0]);
        return this.address;
      } else {
        throw new Error("No accounts returned from wallet");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);

      // Provide more specific error messages
      if (error.code === 4001) {
        throw new Error("Connection rejected by user");
      } else if (error.code === -32002) {
        throw new Error(
          "Connection request already pending. Please check your wallet."
        );
      } else if (
        error.message.includes("network") ||
        error.message.includes("chain")
      ) {
        throw new Error(`Network Error: ${error.message}`);
      }

      throw error;
    }
  }

  async handleConnection(address) {
    console.log("🔄 Handling connection for address:", address);

    // Validate network one more time to be sure
    const networkValid = await this.validateNetwork();

    if (!networkValid) {
      console.warn("Network validation failed during connection handling");
      // Don't throw error here, just set the state correctly
      this.address = address;
      this.isConnected = false; // Connected to wallet but wrong network
      this.isCorrectNetwork = false;

      // Notify listeners about partial connection
      if (this.onConnectionChange) {
        this.onConnectionChange(false, address);
      }

      throw new Error(
        `Wrong network. Please switch to ${MONAD_TESTNET.name} to complete connection.`
      );
    }

    // Set connection state
    this.address = address;
    this.isConnected = true;
    this.isCorrectNetwork = true;

    // Update Web3 service
    web3Service.setWallet(address);

    // Load FUEL balance
    await this.loadFuelBalance();

    console.log(
      `✅ Wallet fully connected: ${address} on ${MONAD_TESTNET.name}`
    );

    // Notify listeners
    if (this.onConnectionChange) {
      this.onConnectionChange(this.isConnected, this.address);
    }
  }

  async handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.handleDisconnect();
    } else {
      await this.handleConnection(accounts[0]);
    }
  }

  async handleChainChanged(chainId) {
    // Convert hex to decimal
    const decimalChainId = parseInt(chainId, 16);
    this.currentChainId = decimalChainId;

    console.log("Chain changed to:", decimalChainId);

    // Update network status
    this.isCorrectNetwork = decimalChainId === MONAD_TESTNET.chainId;

    // Notify network change listeners
    if (this.onNetworkChange) {
      this.onNetworkChange(this.isCorrectNetwork, decimalChainId);
    }

    if (!this.isCorrectNetwork) {
      console.warn(
        `Wrong network detected (${decimalChainId}). Required: ${MONAD_TESTNET.name} (${MONAD_TESTNET.chainId})`
      );

      // If connected, disconnect until network is correct
      if (this.isConnected) {
        console.log("Disconnecting due to wrong network...");
        this.handleNetworkDisconnect();
      }
    } else {
      console.log(`✅ Correct network: ${MONAD_TESTNET.name}`);

      // If we have an address but weren't connected due to wrong network, reconnect
      if (this.address && !this.isConnected) {
        console.log("Reconnecting due to correct network...");
        await this.handleConnection(this.address);
      }
    }
  }

  handleDisconnect() {
    this.isConnected = false;
    this.address = null;
    this.fuelBalance = 0;
    this.isCorrectNetwork = false;
    this.currentChainId = null;

    // Update Web3 service
    web3Service.setWallet(null);

    console.log("Wallet disconnected");

    // Notify listeners
    if (this.onConnectionChange) {
      this.onConnectionChange(this.isConnected, this.address);
    }
  }

  handleNetworkDisconnect() {
    // Keep address but set connection as false due to wrong network
    this.isConnected = false;
    this.fuelBalance = 0;

    // Update Web3 service
    web3Service.setWallet(null);

    console.log("Disconnected due to wrong network");

    // Notify listeners
    if (this.onConnectionChange) {
      this.onConnectionChange(this.isConnected, this.address);
    }
  }

  async validateNetwork() {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const decimalChainId = parseInt(chainId, 16);
      this.currentChainId = decimalChainId;

      this.isCorrectNetwork = decimalChainId === MONAD_TESTNET.chainId;

      if (!this.isCorrectNetwork) {
        console.warn(
          `Wrong network: Current=${decimalChainId}, Required=${MONAD_TESTNET.chainId} (${MONAD_TESTNET.name})`
        );
        return false;
      }

      console.log(`✅ Network validated: ${MONAD_TESTNET.name}`);
      return true;
    } catch (error) {
      console.error("Network validation failed:", error);
      this.isCorrectNetwork = false;
      return false;
    }
  }

  async ensureCorrectNetwork() {
    const isValid = await this.validateNetwork();
    if (!isValid) {
      await this.switchToMonadNetwork();
    }
    return this.isCorrectNetwork;
  }

  async switchToMonadNetwork() {
    try {
      console.log(`🔄 Switching to ${MONAD_TESTNET.name}...`);

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET.chainIdHex }],
      });

      console.log(`✅ Switched to ${MONAD_TESTNET.name}`);
      this.isCorrectNetwork = true;
      return true;
    } catch (switchError) {
      console.error("Switch network error:", switchError);

      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          console.log(`➕ Adding ${MONAD_TESTNET.name} to wallet...`);

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: MONAD_TESTNET.chainIdHex, // 0x279F (10143 decimal)
                chainName: MONAD_TESTNET.name,
                rpcUrls: [MONAD_TESTNET.rpcUrl], // Array format as required
                nativeCurrency: {
                  name: "Monad",
                  symbol: "MON",
                  decimals: 18,
                },
                blockExplorerUrls: [MONAD_TESTNET.explorerUrl],
              },
            ],
          });

          console.log(`✅ Added and switched to ${MONAD_TESTNET.name}`);
          this.isCorrectNetwork = true;
          return true;
        } catch (addError) {
          console.error("Failed to add Monad network:", addError);
          this.isCorrectNetwork = false;
          return false;
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        console.log("User rejected network switch");
        this.isCorrectNetwork = false;
        return false;
      } else {
        console.error("Failed to switch to Monad network:", switchError);
        this.isCorrectNetwork = false;
        return false;
      }
    }
  }

  async loadFuelBalance() {
    if (!this.isConnected) return;

    try {
      this.fuelBalance = await web3Service.getFuelBalance();
      console.log(`FUEL balance: ${this.fuelBalance}`);
    } catch (error) {
      console.error("Failed to load FUEL balance:", error);
      this.fuelBalance = 0;
    }
  }

  disconnect() {
    this.handleDisconnect();
  }

  // Get shortened address for display
  getShortAddress() {
    if (!this.address) return "";
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  }

  // Set callback for connection changes
  onConnect(callback) {
    this.onConnectionChange = callback;
  }

  // Set callback for network changes
  onNetworkStatusChange(callback) {
    this.onNetworkChange = callback;
  }

  // Get current network info
  getNetworkInfo() {
    return {
      isCorrectNetwork: this.isCorrectNetwork,
      currentChainId: this.currentChainId,
      requiredNetwork: MONAD_TESTNET,
    };
  }

  // Check if ready for game operations
  isReadyForGame() {
    return this.isConnected && this.isCorrectNetwork;
  }

  // Check if wallet is already connected
  async checkConnection() {
    if (!this.isWeb3Available) {
      return false;
    }

    try {
      // Check if there are connected accounts
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        // Also validate network before considering connection valid
        const networkValid = await this.validateNetwork();

        if (networkValid) {
          await this.handleConnection(accounts[0]);
          return true;
        } else {
          // Store address but don't connect until network is correct
          this.address = accounts[0];
          console.log(
            `Wallet address found but wrong network. Please switch to ${MONAD_TESTNET.name}`
          );
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("Failed to check wallet connection:", error);
      return false;
    }
  }
}

// Export singleton instance
export const walletManager = new WalletManager();
