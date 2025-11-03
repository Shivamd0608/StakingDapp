import React from 'react';
import { useWallet } from '../hooks/useWallet';

export const ConnectButton = () => {
  const { connectWallet, shortAddress, isConnected } = useWallet();

  return (
    <button 
      onClick={connectWallet}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      {isConnected ? shortAddress : 'Connect Wallet'}
    </button>
  );
};
