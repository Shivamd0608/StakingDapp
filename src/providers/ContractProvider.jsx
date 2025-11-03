import React, { createContext, useContext, useEffect } from 'react';
import { useWeb3 } from './Web3Provider';
import { icoManager } from '../context/ico';
import { stakingManager } from '../context/staking';

const ContractContext = createContext(null);

export function ContractProvider({ children }) {
  const { signer, isConnected } = useWeb3();

  useEffect(() => {
    if (!isConnected || !signer) return;
    
    const init = async () => {
      try {
        await Promise.all([
          icoManager.init(),
          stakingManager.init()
        ]);
      } catch (err) {
        console.error('Contract initialization failed:', err);
      }
    };
    
    init();
  }, [signer, isConnected]);

  return (
    <ContractContext.Provider value={{ ico: icoManager, staking: stakingManager }}>
      {children}
    </ContractContext.Provider>
  );
}

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (!context) throw new Error("useContracts must be used within ContractProvider");
  return context;
};
