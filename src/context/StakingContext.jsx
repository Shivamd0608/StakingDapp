
import React, { createContext, useCallback } from 'react';
import { useEthers } from '../hooks/useEthers';
import * as stakingService from '../services/staking';

export const StakingContext = createContext(null);

export function StakingProvider({ children }) {
  const { signer, provider, account } = useEthers();

  const handleApprove = useCallback((amount) => {
    return stakingService.approve(signer, amount);
  }, [signer]);

  const handleStake = useCallback((poolId, amount) => {
    return stakingService.stake(signer, poolId, amount);
  }, [signer]);

  const handleUnstake = useCallback((poolId, amount) => {
    return stakingService.unstake(signer, poolId, amount);
  }, [signer]);

  const handleClaimReward = useCallback((poolId) => {
    return stakingService.claimReward(signer, poolId);
  }, [signer]);

  const handleGetPoolInfo = useCallback((poolId) => {
    return stakingService.getPoolInfo(provider, poolId);
  }, [provider]);

  const handleGetUserStakingInfo = useCallback((poolId) => {
    return stakingService.getUserStakingInfo(provider, account, poolId);
  }, [provider, account]);

  const handleAddPool = useCallback((lpToken, allocPoint) => {
    return stakingService.addPool(signer, lpToken, allocPoint);
  }, [signer]);

  return (
    <StakingContext.Provider value={{
      approve: handleApprove,
      stake: handleStake,
      unstake: handleUnstake,
      claimReward: handleClaimReward,
      getPoolInfo: handleGetPoolInfo,
      getUserStakingInfo: handleGetUserStakingInfo,
      addPool: handleAddPool,
    }}>
      {children}
    </StakingContext.Provider>
  );
}


