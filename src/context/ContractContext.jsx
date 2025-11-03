import React, { createContext, useContext, useEffect } from 'react';
import { useWeb3 } from './Web3Context';
import { icoManager } from './ico';
import { stakingManager } from './staking';

const ContractContext = createContext();

export function ContractProvider({ children }) {
  const { signer, isConnected } = useWeb3();

  useEffect(() => {
    if (!isConnected || !signer) return;
    
    const initContracts = async () => {
      try {
        await Promise.all([
          icoManager.init(),
          stakingManager.init()
        ]);
      } catch (err) {
        console.error('Failed to initialize contracts:', err);
      }
    };
    
    initContracts();
  }, [signer, isConnected]);

  const value = React.useMemo(() => ({
    ico: icoManager,
    staking: stakingManager
  }), []);

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContracts() {
  const context = useContext(ContractContext);
  if (!context) throw new Error('useContracts must be used within ContractProvider');
  return context;
}