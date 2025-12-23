import React from 'react';
import { useEthers } from '../../hooks/useEthers';

// Format address to show first and last few characters
const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function WalletButton() {
  const { account, isLoading, connectWallet, disconnectWallet, chainId } = useEthers();

  // Get network name
  const getNetworkName = () => {
    switch (chainId) {
      case 1n:
      case 1:
        return 'Mainnet';
      case 11155111n:
      case 11155111:
        return 'Sepolia';
      case 5n:
      case 5:
        return 'Goerli';
      default:
        return chainId ? `Chain ${chainId}` : '';
    }
  };

  if (account) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {chainId && (
          <span 
            style={{ 
              padding: '0.5rem 0.75rem', 
              background: 'var(--bg-card)', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}
          >
            {getNetworkName()}
          </span>
        )}
        <button
          onClick={disconnectWallet}
          className="btn btn-outline"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem'
          }}
        >
          <span style={{ 
            width: '8px', 
            height: '8px', 
            background: 'var(--success-color)', 
            borderRadius: '50%' 
          }} />
          {formatAddress(account)}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="btn btn-primary"
    >
      {isLoading ? (
        <>
          <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
          Connecting...
        </>
      ) : (
        '🦊 Connect Wallet'
      )}
    </button>
  );
}
