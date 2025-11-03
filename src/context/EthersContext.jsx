import React, { createContext, useEffect, useState } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { toast } from 'react-toastify';

export const EthersContext = createContext(null);

export function EthersProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const p = new BrowserProvider(window.ethereum);
      setProvider(p);
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    setAccount(accounts[0] || null);
    if (!accounts[0]) setSigner(null);
  };

  const handleChainChanged = (chainIdHex) => {
    setChainId(parseInt(chainIdHex, 16));
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      if (!provider) throw new Error('No provider available');
      
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      
      const s = await provider.getSigner();
      setSigner(s);
      
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      
      return accounts[0];
    } catch (error) {
      toast.error('Failed to connect wallet: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
  };

  const getContract = (address, abi) => {
    if (!address || !abi) throw new Error('Invalid contract parameters');
    return new Contract(address, abi, signer || provider);
  };

  return (
    <EthersContext.Provider value={{
      provider,
      signer,
      account,
      chainId,
      isLoading,
      connectWallet,
      disconnectWallet,
      getContract,
      parseEther,
      formatEther
    }}>
      {children}
    </EthersContext.Provider>
  );
}
