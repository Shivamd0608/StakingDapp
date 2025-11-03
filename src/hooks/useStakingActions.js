import { useState } from 'react';
import { useContracts } from '../context/ContractContext';
import { ethers } from 'ethers';

export const useStakingActions = (onSuccess = () => {}) => {
  const { staking } = useContracts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStakingAction = async (action, amount = '0') => {
    setLoading(true);
    setError(null);
    try {
      let transaction;
      switch (action) {
        case 'stake':
          transaction = await staking.stake(amount);
          break;
        case 'unstake':
          transaction = await staking.unstake(amount);
          break;
        case 'claim':
          transaction = await staking.claimRewards();
          break;
        default:
          throw new Error('Invalid action');
      }
      await transaction.wait();
      onSuccess();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleStakingAction,
    loading,
    error
  };
};
