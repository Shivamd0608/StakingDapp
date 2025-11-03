import { createContext, useContext, useEffect } from 'react';
import { icoManager } from '../context/ico';
import { stakingManager } from '../context/staking';
import { useWeb3 } from './useWeb3';

const ContractContext = createContext(null);

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) throw new Error('useContract must be used within ContractProvider');
  return context;
};

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
      } catch (error) {
        console.error('Failed to initialize contracts:', error);
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
