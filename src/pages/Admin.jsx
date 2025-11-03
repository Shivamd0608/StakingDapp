import React, { useState } from 'react';

const Admin = () => {
  const [depositToken, setDepositToken] = useState('');
  const [rewardToken, setRewardToken] = useState('');
  const [apy, setApy] = useState('');
  const [lockDays, setLockDays] = useState('');
  const [poolId, setPoolId] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [newApy, setNewApy] = useState('');

  const handleAddPool = () => {
    // TODO: Implement add pool functionality
    console.log('Adding pool:', { depositToken, rewardToken, apy, lockDays });
  };

  const handleFundRewards = () => {
    // TODO: Implement fund rewards functionality
    console.log('Funding rewards for pool', poolId, 'with amount:', fundAmount);
  };

  const handleModifyPool = () => {
    // TODO: Implement modify pool functionality
    console.log('Modifying APY for pool', poolId, 'to:', newApy);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <div>
        <h3>Add Pool</h3>
        <input
          type="text"
          placeholder="Deposit Token Address"
          value={depositToken}
          onChange={(e) => setDepositToken(e.target.value)}
        />
        <input
          type="text"
          placeholder="Reward Token Address"
          value={rewardToken}
          onChange={(e) => setRewardToken(e.target.value)}
        />
        <input
          type="text"
          placeholder="APY"
          value={apy}
          onChange={(e) => setApy(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lock Days"
          value={lockDays}
          onChange={(e) => setLockDays(e.target.value)}
        />
        <button onClick={handleAddPool}>Add Pool</button>
      </div>
      <div>
        <h3>Fund Rewards</h3>
        <input
          type="text"
          placeholder="Pool ID"
          value={poolId}
          onChange={(e) => setPoolId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
        />
        <button onClick={handleFundRewards}>Fund Rewards</button>
      </div>
      <div>
        <h3>Modify Pool APY</h3>
        <input
          type="text"
          placeholder="Pool ID"
          value={poolId}
          onChange={(e) => setPoolId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New APY"
          value={newApy}
          onChange={(e) => setNewApy(e.target.value)}
        />
        <button onClick={handleModifyPool}>Modify Pool</button>
      </div>
    </div>
  );
};

export default Admin;
