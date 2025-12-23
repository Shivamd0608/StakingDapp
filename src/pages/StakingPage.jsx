import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '../hooks/useEthers';
import * as stakingService from '../services/staking';

function StakingPage() {
  const { provider, signer, account } = useEthers();
  
  // State
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(BigInt(0));
  const [allowance, setAllowance] = useState(BigInt(0));
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('stake');
  
  // Admin state
  const [depositToken, setDepositToken] = useState('');
  const [rewardToken, setRewardToken] = useState('');
  const [apy, setApy] = useState('');
  const [lockDays, setLockDays] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [newApy, setNewApy] = useState('');

  // Fetch all pools
  const fetchPools = useCallback(async () => {
    if (!provider) return;
    
    try {
      const allPools = await stakingService.getAllPools(provider);
      
      // Get token info for each pool
      const poolsWithInfo = await Promise.all(
        allPools.map(async (pool) => {
          const depositTokenInfo = await stakingService.getTokenInfo(provider, pool.depositToken);
          const rewardTokenInfo = await stakingService.getTokenInfo(provider, pool.rewardToken);
          return {
            ...pool,
            depositTokenInfo,
            rewardTokenInfo
          };
        })
      );
      
      setPools(poolsWithInfo);
      
      if (poolsWithInfo.length > 0 && !selectedPool) {
        setSelectedPool(poolsWithInfo[0]);
      }
      
      // Check if user is owner
      const owner = await stakingService.getOwner(provider);
      setIsOwner(owner?.toLowerCase() === account?.toLowerCase());
    } catch (error) {
      console.error('Error fetching pools:', error);
    }
  }, [provider, account, selectedPool]);

  // Fetch user info for selected pool
  const fetchUserInfo = useCallback(async () => {
    if (!provider || !account || selectedPool === null) return;
    
    try {
      const info = await stakingService.getUserStakingInfo(provider, account, selectedPool.poolId);
      setUserInfo(info);
      
      // Get token balance
      const balance = await stakingService.getTokenBalance(provider, selectedPool.depositToken, account);
      setTokenBalance(balance);
      
      // Get allowance
      const currentAllowance = await stakingService.checkAllowance(provider, selectedPool.depositToken, account);
      setAllowance(currentAllowance);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, [provider, account, selectedPool]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  useEffect(() => {
    if (selectedPool) {
      fetchUserInfo();
    }
  }, [selectedPool, fetchUserInfo]);

  // Format ether values
  const formatEth = (value) => {
    if (!value) return '0';
    try {
      return parseFloat(ethers.formatEther(value)).toFixed(4);
    } catch {
      return '0';
    }
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!userInfo?.lockUntil) return null;
    const lockUntil = Number(userInfo.lockUntil);
    const now = Math.floor(Date.now() / 1000);
    const remaining = lockUntil - now;
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Check if unlock time has passed
  const isUnlocked = () => {
    if (!userInfo?.lockUntil) return true;
    const lockUntil = Number(userInfo.lockUntil);
    const now = Math.floor(Date.now() / 1000);
    return now >= lockUntil;
  };

  // Check if needs approval
  const needsApproval = () => {
    if (!amount) return false;
    try {
      const amountWei = ethers.parseEther(amount);
      return allowance < amountWei;
    } catch {
      return false;
    }
  };

  // Handle approve
  const handleApprove = async () => {
    if (!amount || !signer || !selectedPool) return;
    
    setIsLoading(true);
    try {
      await stakingService.approve(signer, selectedPool.depositToken, amount);
      await fetchUserInfo();
    } catch (error) {
      console.error('Approve error:', error);
    }
    setIsLoading(false);
  };

  // Handle stake
  const handleStake = async () => {
    if (!amount || !signer || !selectedPool) return;
    
    setIsLoading(true);
    try {
      await stakingService.stake(signer, selectedPool.poolId, amount);
      setAmount('');
      await fetchUserInfo();
      await fetchPools();
    } catch (error) {
      console.error('Stake error:', error);
    }
    setIsLoading(false);
  };

  // Handle unstake
  const handleUnstake = async () => {
    if (!amount || !signer || !selectedPool) return;
    
    setIsLoading(true);
    try {
      await stakingService.unstake(signer, selectedPool.poolId, amount);
      setAmount('');
      await fetchUserInfo();
      await fetchPools();
    } catch (error) {
      console.error('Unstake error:', error);
    }
    setIsLoading(false);
  };

  // Handle claim
  const handleClaim = async () => {
    if (!signer || !selectedPool) return;
    
    setIsLoading(true);
    try {
      await stakingService.claimReward(signer, selectedPool.poolId);
      await fetchUserInfo();
    } catch (error) {
      console.error('Claim error:', error);
    }
    setIsLoading(false);
  };

  // Handle max button
  const handleMax = () => {
    if (activeTab === 'stake') {
      setAmount(ethers.formatEther(tokenBalance));
    } else {
      setAmount(ethers.formatEther(userInfo?.amount || BigInt(0)));
    }
  };

  // Admin: Add pool
  const handleAddPool = async () => {
    if (!depositToken || !rewardToken || !apy || !lockDays || !signer) return;
    
    setIsLoading(true);
    try {
      await stakingService.addPool(signer, depositToken, rewardToken, apy, lockDays);
      setDepositToken('');
      setRewardToken('');
      setApy('');
      setLockDays('');
      await fetchPools();
    } catch (error) {
      console.error('Add pool error:', error);
    }
    setIsLoading(false);
  };

  // Admin: Fund rewards
  const handleFundRewards = async () => {
    if (!fundAmount || !signer || !selectedPool) return;
    
    setIsLoading(true);
    try {
      // First approve the reward token
      await stakingService.approve(signer, selectedPool.rewardToken, fundAmount);
      await stakingService.fundRewards(signer, selectedPool.poolId, fundAmount);
      setFundAmount('');
      await fetchPools();
    } catch (error) {
      console.error('Fund rewards error:', error);
    }
    setIsLoading(false);
  };

  // Admin: Modify APY
  const handleModifyApy = async () => {
    if (!newApy || !signer || !selectedPool) return;
    
    setIsLoading(true);
    try {
      await stakingService.modifyPool(signer, selectedPool.poolId, newApy);
      setNewApy('');
      await fetchPools();
    } catch (error) {
      console.error('Modify APY error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="ico-hero">
        <h1>🔒 Staking Pools</h1>
        <p>Stake your tokens and earn rewards</p>
      </div>

      {/* Pool Selection */}
      {pools.length > 0 ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Pools</div>
              <div className="stat-value">{pools.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Your Staked</div>
              <div className="stat-value highlight">
                {formatEth(userInfo?.amount)} {selectedPool?.depositTokenInfo?.symbol}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending Rewards</div>
              <div className="stat-value highlight">
                {formatEth(userInfo?.pendingReward)} {selectedPool?.rewardTokenInfo?.symbol}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Your Balance</div>
              <div className="stat-value">
                {formatEth(tokenBalance)} {selectedPool?.depositTokenInfo?.symbol}
              </div>
            </div>
          </div>

          {/* Pool Cards */}
          <div className="pools-grid">
            {pools.map((pool) => (
              <div
                key={pool.poolId}
                className={`pool-card ${selectedPool?.poolId === pool.poolId ? 'selected' : ''}`}
                onClick={() => setSelectedPool(pool)}
                style={{
                  cursor: 'pointer',
                  border: selectedPool?.poolId === pool.poolId ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
                }}
              >
                <div className="pool-header">
                  <div className="pool-title">
                    {pool.depositTokenInfo?.symbol} → {pool.rewardTokenInfo?.symbol}
                  </div>
                  <span className="pool-badge">{pool.apy?.toString()}% APY</span>
                </div>

                <div className="pool-stats">
                  <div className="pool-stat">
                    <div className="pool-stat-label">Total Staked</div>
                    <div className="pool-stat-value">{formatEth(pool.depositedAmount)}</div>
                  </div>
                  <div className="pool-stat">
                    <div className="pool-stat-label">Lock Period</div>
                    <div className="pool-stat-value">{pool.lockDays?.toString()} Days</div>
                  </div>
                  <div className="pool-stat">
                    <div className="pool-stat-label">Reward Fund</div>
                    <div className="pool-stat-value">{formatEth(pool.rewardFund)}</div>
                  </div>
                  <div className="pool-stat">
                    <div className="pool-stat-label">Pool ID</div>
                    <div className="pool-stat-value">#{pool.poolId}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Panel */}
          {selectedPool && (
            <div className="card mt-4">
              <div className="card-header">
                <span className="card-title">
                  Pool #{selectedPool.poolId}: {selectedPool.depositTokenInfo?.symbol}
                </span>
                {userInfo?.lockUntil > 0 && !isUnlocked() && (
                  <span className="badge badge-warning">
                    🔒 Locked: {getTimeRemaining()}
                  </span>
                )}
                {userInfo?.lockUntil > 0 && isUnlocked() && (
                  <span className="badge badge-success">🔓 Unlocked</span>
                )}
              </div>

              {/* Tabs */}
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'stake' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stake')}
                >
                  Stake
                </button>
                <button
                  className={`tab ${activeTab === 'unstake' ? 'active' : ''}`}
                  onClick={() => setActiveTab('unstake')}
                >
                  Unstake
                </button>
              </div>

              {/* Amount Input */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    {activeTab === 'stake' ? 'Stake Amount' : 'Unstake Amount'}
                  </label>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {activeTab === 'stake' 
                      ? `Balance: ${formatEth(tokenBalance)}`
                      : `Staked: ${formatEth(userInfo?.amount)}`
                    }
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.01"
                  />
                  <button className="btn btn-outline" onClick={handleMax}>
                    MAX
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pool-actions mt-4">
                {activeTab === 'stake' ? (
                  <>
                    {needsApproval() ? (
                      <button
                        className="btn btn-secondary"
                        onClick={handleApprove}
                        disabled={isLoading || !amount}
                      >
                        {isLoading ? 'Approving...' : 'Approve'}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={handleStake}
                        disabled={isLoading || !amount}
                      >
                        {isLoading ? 'Staking...' : 'Stake'}
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleUnstake}
                    disabled={isLoading || !amount || !isUnlocked()}
                  >
                    {isLoading ? 'Unstaking...' : 'Unstake'}
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={handleClaim}
                  disabled={isLoading || !userInfo?.pendingReward || userInfo?.pendingReward === BigInt(0)}
                >
                  {isLoading ? 'Claiming...' : `Claim ${formatEth(userInfo?.pendingReward)} Rewards`}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card">
          <div className="connect-message">
            <h2>No Pools Available</h2>
            <p>There are no staking pools created yet. {isOwner ? 'Create one below!' : 'Please check back later.'}</p>
          </div>
        </div>
      )}

      {/* Admin Section */}
      {isOwner && (
        <div className="card admin-section mt-4">
          <h3>Admin Controls</h3>
          
          {/* Add Pool */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Create New Pool</h4>
            <div className="admin-grid">
              <div className="form-group">
                <label className="form-label">Deposit Token Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={depositToken}
                  onChange={(e) => setDepositToken(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reward Token Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={rewardToken}
                  onChange={(e) => setRewardToken(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">APY (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={apy}
                  onChange={(e) => setApy(e.target.value)}
                  placeholder="e.g., 20"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lock Days</label>
                <input
                  type="number"
                  className="form-input"
                  value={lockDays}
                  onChange={(e) => setLockDays(e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>
            </div>
            <button
              className="btn btn-primary mt-2"
              onClick={handleAddPool}
              disabled={isLoading || !depositToken || !rewardToken || !apy || !lockDays}
            >
              {isLoading ? 'Creating...' : 'Create Pool'}
            </button>
          </div>

          {/* Fund Rewards & Modify APY */}
          {selectedPool && (
            <div className="admin-grid">
              <div className="form-group">
                <label className="form-label">Fund Rewards (Pool #{selectedPool.poolId})</label>
                <input
                  type="number"
                  className="form-input"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Amount"
                />
                <button
                  className="btn btn-secondary mt-2 w-full"
                  onClick={handleFundRewards}
                  disabled={isLoading || !fundAmount}
                >
                  Fund Rewards
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Modify APY (Pool #{selectedPool.poolId})</label>
                <input
                  type="number"
                  className="form-input"
                  value={newApy}
                  onChange={(e) => setNewApy(e.target.value)}
                  placeholder="New APY %"
                />
                <button
                  className="btn btn-secondary mt-2 w-full"
                  onClick={handleModifyApy}
                  disabled={isLoading || !newApy}
                >
                  Update APY
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StakingPage;
