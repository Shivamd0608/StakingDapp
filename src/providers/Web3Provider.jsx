import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [state, setState] = useState({
    account: null,
    provider: null,
    signer: null,
    isConnected: false
  });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      
      setState({ provider, signer, account, isConnected: true });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <Web3Context.Provider value={{ ...state, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within Web3Provider");
  return context;
};
