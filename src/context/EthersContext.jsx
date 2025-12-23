import React, { createContext, useEffect, useState, useCallback } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { toast } from 'react-toastify';

export const EthersContext = createContext(null);

const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '11155111');
const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || 'Sepolia';
const RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo';

export function EthersProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize provider
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const browserProvider = new BrowserProvider(window.ethereum);
          setProvider(browserProvider);
          
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const signer = await browserProvider.getSigner();
            setSigner(signer);
            const network = await browserProvider.getNetwork();
            setChainId(Number(network.chainId));
          }
        } catch (err) {
          console.error('Failed to initialize provider:', err);
        }
      }
      setIsInitialized(true);
    };

    init();
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
      } else {
        setAccount(accounts[0]);
        if (provider) {
          const signer = await provider.getSigner();
          setSigner(signer);
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [provider]);

  // Switch to correct network
  const switchNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: NETWORK_NAME,
              rpcUrls: [RPC_URL],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      window.open('https://metamask.io/download/', '_blank');
      return null;
    }

    setIsLoading(true);
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      
      const signer = await browserProvider.getSigner();
      setSigner(signer);
      setAccount(accounts[0]);
      
      // Get and check network
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);
      
      // Switch to correct network if needed
      if (currentChainId !== CHAIN_ID) {
        toast.info(`Switching to ${NETWORK_NAME}...`);
        await switchNetwork();
      }

      toast.success('Wallet connected!');
      return accounts[0];
    } catch (error) {
      console.error('Connect wallet error:', error);
      if (error.code === 4001) {
        toast.error('Connection rejected by user');
      } else {
        toast.error('Failed to connect: ' + (error.message || 'Unknown error'));
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setChainId(null);
    toast.info('Wallet disconnected');
  }, []);

  const getContract = useCallback((address, abi) => {
    if (!address || !abi) throw new Error('Invalid contract parameters');
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) throw new Error('No provider available');
    return new Contract(address, abi, signerOrProvider);
  }, [signer, provider]);

  return (
    <EthersContext.Provider value={{
      provider,
      signer,
      account,
      chainId,
      isLoading,
      isInitialized,
      connectWallet,
      disconnectWallet,
      getContract,
      parseEther,
      formatEther,
      CHAIN_ID,
      NETWORK_NAME
    }}>
      {children}
    </EthersContext.Provider>
  );
}

