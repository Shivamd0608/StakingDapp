import { useContext, useState, useCallback } from 'react';
import { StakingContext } from '../context/StakingContext';
import { useContracts } from '../context/ContractContext';

export const useStaking = () => {
  const { staking } = useContracts();
  const [isLoading, setIsLoading] = useState(false);

  const handleStake = useCallback(async (amount) => {
    setIsLoading(true);
    try {
      const tx = await staking.stake(amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Staking error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [staking]);

  const getStakingInfo = useCallback(async () => {
    try {
      return await staking.getStakingInfo();
    } catch (error) {
      console.error('Error fetching staking info:', error);
      return null;
    }
  }, [staking]);

  return {
    stake: handleStake,
    getStakingInfo,
    isLoading
  };
};