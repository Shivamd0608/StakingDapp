import { useWeb3 } from '../context/Web3Context';
import { useEffect, useState } from 'react';

export const useWallet = () => {
  const { account, connectWallet, isConnected, chainId } = useWeb3();
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (account) {
      setShortAddress(`${account.slice(0, 6)}...${account.slice(-4)}`);
    }
  }, [account]);

  return {
    account,
    shortAddress,
    connectWallet,
    isConnected,
    chainId
  };
};
