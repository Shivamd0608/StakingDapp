import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within Web3Provider');
  return context;
};

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // ...Web3 connection logic...

  return (
    <Web3Context.Provider value={{ account, provider, signer, isConnected }}>
      {children}
    </Web3Context.Provider>
  );
}
