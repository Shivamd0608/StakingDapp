import React, { useState, useEffect } from 'react';
import { useContracts } from '../context/ContractContext';
import { useWeb3 } from '../context/Web3Context';
import { formatBalance } from '../utils/formatters';

export const StakingDashboard = () => {
  const { staking } = useContracts();
  const { isConnected } = useWeb3();
  const [stakingInfo, setStakingInfo] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isConnected) {
      loadStakingInfo();
    }
  }, [isConnected]);

  const loadStakingInfo = async () => {
    const info = await staking.getStakingInfo();
    setStakingInfo(info);
  };

  const handleStake = async () => {
    setLoading(true);
    setError(null);
    try {
      await staking.stake(stakeAmount);
      await loadStakingInfo();
      setStakeAmount('');
    } catch (err) {
      setError('Stake failed. Please try again.');
      console.error("Stake failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    setLoading(true);
    setError(null);
    try {
      await staking.unstake(stakeAmount);
      await loadStakingInfo();
      setStakeAmount('');
    } catch (err) {
      setError('Unstake failed. Please try again.');
      console.error("Unstake failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      await staking.claimRewards();
      await loadStakingInfo();
    } catch (err) {
      setError('Claim failed. Please try again.');
      console.error("Claim failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <p>Please connect your wallet</p>;

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Staking Dashboard</h2>
      
      {stakingInfo && (
        <div className="space-y-4">
          <div>
            <p>Your Stake: {formatBalance(stakingInfo.userStake)}</p>
            <p>Pending Rewards: {formatBalance(stakingInfo.pendingRewards)}</p>
            <p>Total Staked: {formatBalance(stakingInfo.totalStaked)}</p>
            <p>APR: {stakingInfo.apr}%</p>
          </div>

          <div className="space-y-2">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Amount"
            />
            
            <div className="flex space-x-2">
              <button
                onClick={handleStake}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded flex-1"
              >
                {loading ? 'Staking...' : 'Stake'}
              </button>
              <button
                onClick={handleUnstake}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded flex-1"
              >
                {loading ? 'Unstaking...' : 'Unstake'}
              </button>
            </div>

            <button
              onClick={handleClaim}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              {loading ? 'Claiming...' : 'Claim Rewards'}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};
