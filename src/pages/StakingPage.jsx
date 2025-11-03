import React, { useState, useEffect } from 'react';
import { useStaking } from '../hooks/useStaking';

function StakingPage() {
  const { approve, stake, unstake, claimReward, getPoolInfo, getUserStakingInfo, addPool } = useStaking();
  const [poolId, setPoolId] = useState(0);
  const [amount, setAmount] = useState('');
  const [poolInfo, setPoolInfo] = useState(null);
  const [userStakingInfo, setUserStakingInfo] = useState(null);
  const [lpToken, setLpToken] = useState('');
  const [allocPoint, setAllocPoint] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const info = await getPoolInfo(poolId);
      setPoolInfo(info);
      const user_info = await getUserStakingInfo(poolId);
      setUserStakingInfo(user_info);
    };
    fetchData();
  }, [getPoolInfo, getUserStakingInfo, poolId]);

  const handleApprove = async () => {
    if (!amount) return;
    await approve(amount);
  };

  const handleStake = async () => {
    if (!amount) return;
    await stake(poolId, amount);
    setAmount('');
  };

  const handleUnstake = async () => {
    if (!amount) return;
    await unstake(poolId, amount);
    setAmount('');
  };

  const handleClaimReward = async () => {
    await claimReward(poolId);
  };

  const handleAddPool = async () => {
    if (!lpToken || !allocPoint) return;
    await addPool(lpToken, allocPoint);
    setLpToken('');
    setAllocPoint('');
  };

  return (
    <div>
      <h2>Staking</h2>
      <div>
        <h3>Pool Info</h3>
        {poolInfo && (
          <div>
            <p>LP Token: {poolInfo.lpToken}</p>
            <p>Allocation Point: {poolInfo.allocPoint.toString()}</p>
          </div>
        )}
      </div>
      <div>
        <h3>Your Staking Info</h3>
        {userStakingInfo && userStakingInfo.userInfo && (
          <div>
            <p>Staked Amount: {userStakingInfo.userInfo.amount.toString()}</p>
            <p>Reward Debt: {userStakingInfo.userInfo.rewardDebt.toString()}</p>
            <p>Pending Reward: {userStakingInfo.pendingReward?.toString()}</p>
          </div>
        )}
      </div>
      <div className="form">
        <input
          type="number"
          value={poolId}
          onChange={(e) => setPoolId(e.target.value)}
          placeholder="Pool ID"
        />
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleStake}>Stake</button>
        <button onClick={handleUnstake}>Unstake</button>
        <button onClick={handleClaimReward}>Claim Reward</button>
      </div>
      <div className="admin-section">
        <h3>Admin</h3>
        <input
          type="text"
          value={lpToken}
          onChange={(e) => setLpToken(e.target.value)}
          placeholder="LP Token Address"
        />
        <input
          type="text"
          value={allocPoint}
          onChange={(e) => setAllocPoint(e.target.value)}
          placeholder="Allocation Point"
        />
        <button onClick={handleAddPool}>Add Pool</button>
      </div>
    </div>
  );
}

export default StakingPage;