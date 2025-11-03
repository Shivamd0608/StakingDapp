import React from 'react';

const PoolCard = ({ pool }) => {
  return (
    <div>
      <h4>Pool #{pool.id}</h4>
      <p>Deposit Token: {pool.depositToken}</p>
      <p>Reward Token: {pool.rewardToken}</p>
      <p>APY: {pool.apy}%</p>
      <p>Lock Days: {pool.lockDays}</p>
    </div>
  );
};

export default PoolCard;
