import React, { createContext, useContext, useEffect } from 'react';
import { useWeb3 } from './Web3Context';
import { icoManager } from './ico';
import { stakingManager } from './staking';

const ContractContext = createContext();

export function ContractProvider({ children }) {
  const { signer, isConnected } = useWeb3();

  useEffect(() => {
    if (typeof window === 'undefined') return; // guard SSR
    if (!isConnected || !signer) return;

    const initializeContracts = async () => {
      try {
        const tasks = [];
        if (icoManager && typeof icoManager.init === 'function') tasks.push(icoManager.init());
        if (stakingManager && typeof stakingManager.init === 'function') tasks.push(stakingManager.init());
        await Promise.all(tasks);
      } catch (err) {
        // Log but do not rethrow to avoid crashing the app
        console.error('Failed to initialize contracts:', err);
      }
    };

    initializeContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, isConnected]);

  return (
    <ContractContext.Provider value={{
      ico: icoManager,
      staking: stakingManager
    }}>
      {children}
    </ContractContext.Provider>
  );
}

export const useContracts = () => useContext(ContractContext);
