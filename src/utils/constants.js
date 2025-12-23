
// Contract Addresses from .env
export const ICO_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_ICO;
export const STAKING_CONTRACT_ADDRESS = import.meta.env.VITE_STAKING_DAPP;
export const TOKEN_ADDRESS = import.meta.env.VITE_DEPOSIT_TOKEN;
export const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN;
export const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS;

// Network Configuration
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || "11155111");
export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || "Sepolia";
export const RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;
export const EXPLORER_URL = import.meta.env.VITE_EXPLORER || "https://sepolia.etherscan.io/";
export const TOKEN_LOGO = import.meta.env.VITE_TOKEN_LOGO;
export const CURRENCY = import.meta.env.VITE_CURRENCY || "ETH";

// Network configuration object
export const NETWORKS = {
  11155111: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: RPC_URL,
    blockExplorer: EXPLORER_URL,
    currency: {
      name: "SepoliaETH",
      symbol: "ETH",
      decimals: 18
    }
  }
};
