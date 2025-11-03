import React from 'react';
import { useEthers } from '../../hooks/useEthers';
import { formatAddress } from '../../utils/formatter';

export default function WalletButton() {
  const { account, isLoading, connectWallet, disconnectWallet } = useEthers();

  if (account) {
    return (
      <button
        onClick={disconnectWallet}
        className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
      >
        {formatAddress(account)}
      </button>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}