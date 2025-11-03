export const NETWORK_CONFIG = {
  chainId: import.meta.env.VITE_CHAIN_ID,
  name: import.meta.env.VITE_NETWORK_NAME,
  currency: import.meta.env.VITE_CURRENCY,
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
  explorerUrl: import.meta.env.VITE_EXPLORER,
  decimals: parseInt(import.meta.env.VITE_NETWORK_DECIMALS)
};

export const isCorrectNetwork = (chainId) => 
  chainId === parseInt(import.meta.env.VITE_CHAIN_ID);