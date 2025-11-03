import React from 'react';

const UserStats = ({ userStats }) => {
  return (
    <div>
      <h3>Your Stats</h3>
      <p>Staked Amount: {userStats.stakedAmount}</p>
      <p>Pending Rewards: {userStats.pendingRewards}</p>
      <p>Lock Time Remaining: {userStats.lockTimeRemaining}</p>
    </div>
  );
};

export default UserStats;
