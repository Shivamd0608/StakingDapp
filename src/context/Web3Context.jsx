import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', connectWallet);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet);
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ account, provider, signer, isConnected, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within Web3Provider');
  return context;
}