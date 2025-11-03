import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const initializeWeb3 = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return; // guard SSR
      if (!window.ethereum) return; // nothing to do if no wallet
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      const sgn = prov.getSigner();
      // getAddress can throw if not connected; handle gracefully
      let addr = null;
      try {
        addr = await sgn.getAddress();
      } catch (e) {
        // user not connected yet
      }
      const network = await prov.getNetwork();

      setProvider(prov);
      setSigner(sgn);
      if (addr) setAccount(addr);
      setChainId(network.chainId);
      setIsConnected(!!addr);
    } catch (err) {
      console.error('initializeWeb3 error:', err);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window === 'undefined') throw new Error('Window is not available');
      if (!window.ethereum) throw new Error('MetaMask not found');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await initializeWeb3();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [initializeWeb3]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAccountsChanged = async (accounts) => {
      try {
        if (accounts && accounts.length > 0) {
          await initializeWeb3();
        } else {
          // disconnected
          setAccount(null);
          setIsConnected(false);
        }
      } catch (e) {
        console.error('accountsChanged handler error:', e);
      }
    };

    const handleChainChanged = async () => {
      // re-init provider & signer
      try {
        await initializeWeb3();
      } catch (e) {
        console.error('chainChanged handler error:', e);
      }
    };

    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // initial check (do not throw)
    (async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await initializeWeb3();
          }
        }
      } catch (e) {
        console.error('initial eth_accounts check failed:', e);
      }
    })();

    return () => {
      try {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [initializeWeb3]);

  return (
    <Web3Context.Provider value={{
      account,
      provider,
      signer,
      chainId,
      isConnected,
      connectWallet,
      initializeWeb3
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
