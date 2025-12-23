import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '../hooks/useEthers';
import * as icoService from '../services/ico';

function ICOPage() {
  const { provider, signer, account } = useEthers();
  
  // State
  const [icoInfo, setIcoInfo] = useState(null);
  const [userBalance, setUserBalance] = useState(BigInt(0));
  const [tokenAmount, setTokenAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  // Admin state
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Fetch ICO data
  const fetchData = useCallback(async () => {
    if (!provider) return;
    
    try {
      const info = await icoService.getICOInfo(provider);
      setIcoInfo(info);
      
      if (account && info?.tokenAddress) {
        const balance = await icoService.getUserTokenBalance(provider, info.tokenAddress, account);
        setUserBalance(balance);
        
        // Check if user is owner
        setIsOwner(info.owner?.toLowerCase() === account?.toLowerCase());
      }
    } catch (error) {
      console.error('Error fetching ICO data:', error);
    }
  }, [provider, account]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate ETH needed for purchase
  const calculateEthNeeded = () => {
    if (!tokenAmount || !icoInfo?.tokenPrice) return '0';
    try {
      const ethNeeded = BigInt(tokenAmount) * icoInfo.tokenPrice;
      return ethers.formatEther(ethNeeded);
    } catch {
      return '0';
    }
  };

  // Handle buy tokens
  const handleBuyTokens = async () => {
    if (!tokenAmount || !signer) return;
    
    setIsLoading(true);
    try {
      await icoService.buyTokens(signer, tokenAmount);
      setTokenAmount('');
      await fetchData();
    } catch (error) {
      console.error('Buy error:', error);
    }
    setIsLoading(false);
  };

  // Admin functions
  const handleUpdateToken = async () => {
    if (!newTokenAddress || !signer) return;
    setIsLoading(true);
    try {
      await icoService.updateToken(signer, newTokenAddress);
      setNewTokenAddress('');
      await fetchData();
    } catch (error) {
      console.error('Update token error:', error);
    }
    setIsLoading(false);
  };

  const handleUpdatePrice = async () => {
    if (!newPrice || !signer) return;
    setIsLoading(true);
    try {
      await icoService.updateTokenSalePrice(signer, newPrice);
      setNewPrice('');
      await fetchData();
    } catch (error) {
      console.error('Update price error:', error);
    }
    setIsLoading(false);
  };

  const handleWithdrawTokens = async () => {
    if (!signer) return;
    setIsLoading(true);
    try {
      await icoService.withdrawAllTokens(signer);
      await fetchData();
    } catch (error) {
      console.error('Withdraw error:', error);
    }
    setIsLoading(false);
  };

  // Format large numbers
  const formatTokenAmount = (amount) => {
    if (!amount) return '0';
    try {
      return ethers.formatEther(amount);
    } catch {
      return '0';
    }
  };

  return (
    <div className="ico-container">
      {/* Hero Section */}
      <div className="ico-hero">
        <h1>🐉 {icoInfo?.name || 'Token'} ICO</h1>
        <p>Purchase {icoInfo?.symbol || 'tokens'} with ETH</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Token Price</div>
          <div className="stat-value">
            {icoInfo?.tokenPrice ? ethers.formatEther(icoInfo.tokenPrice) : '0'} ETH
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tokens Sold</div>
          <div className="stat-value highlight">{icoInfo?.soldTokens?.toString() || '0'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available for Sale</div>
          <div className="stat-value">{formatTokenAmount(icoInfo?.balance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Balance</div>
          <div className="stat-value">{formatTokenAmount(userBalance)} {icoInfo?.symbol}</div>
        </div>
      </div>

      {/* Buy Form */}
      <div className="buy-form">
        <h3 className="card-title mb-4">Buy Tokens</h3>
        
        <div className="token-info">
          <div className="token-info-item">
            <div className="token-info-label">Token Name</div>
            <div className="token-info-value">{icoInfo?.name || 'N/A'}</div>
          </div>
          <div className="token-info-item">
            <div className="token-info-label">Symbol</div>
            <div className="token-info-value">{icoInfo?.symbol || 'N/A'}</div>
          </div>
          <div className="token-info-item">
            <div className="token-info-label">Total Supply</div>
            <div className="token-info-value">{formatTokenAmount(icoInfo?.supply)}</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Amount of Tokens to Buy</label>
          <input
            type="number"
            className="form-input"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            placeholder="Enter token amount"
            min="1"
          />
        </div>

        <div className="token-info mb-4">
          <div className="token-info-item">
            <div className="token-info-label">You will pay</div>
            <div className="token-info-value">{calculateEthNeeded()} ETH</div>
          </div>
          <div className="token-info-item">
            <div className="token-info-label">You will receive</div>
            <div className="token-info-value">{tokenAmount || '0'} {icoInfo?.symbol || 'Tokens'}</div>
          </div>
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={handleBuyTokens}
          disabled={isLoading || !tokenAmount || !signer}
        >
          {isLoading ? 'Processing...' : 'Buy Tokens'}
        </button>
      </div>

      {/* Admin Section */}
      {isOwner && (
        <div className="card admin-section">
          <h3>Admin Controls</h3>
          
          <div className="admin-grid">
            <div className="form-group">
              <label className="form-label">Update Token Address</label>
              <input
                type="text"
                className="form-input"
                value={newTokenAddress}
                onChange={(e) => setNewTokenAddress(e.target.value)}
                placeholder="0x..."
              />
              <button
                className="btn btn-secondary mt-2 w-full"
                onClick={handleUpdateToken}
                disabled={isLoading || !newTokenAddress}
              >
                Update Token
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Update Price (in Wei)</label>
              <input
                type="number"
                className="form-input"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Price in Wei"
              />
              <button
                className="btn btn-secondary mt-2 w-full"
                onClick={handleUpdatePrice}
                disabled={isLoading || !newPrice}
              >
                Update Price
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Withdraw Tokens</label>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Withdraw all unsold tokens from the ICO contract
              </p>
              <button
                className="btn btn-danger w-full"
                onClick={handleWithdrawTokens}
                disabled={isLoading}
              >
                Withdraw All Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Info */}
      <div className="card mt-4">
        <h3 className="card-title mb-4">Contract Information</h3>
        <div className="form-group">
          <label className="form-label">Token Address</label>
          <input
            type="text"
            className="form-input"
            value={icoInfo?.tokenAddress || 'Not set'}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">ICO Owner</label>
          <input
            type="text"
            className="form-input"
            value={icoInfo?.owner || 'Unknown'}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default ICOPage;
