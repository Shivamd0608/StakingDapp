
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import StakingDappABI from '../abi/StakingDapp';
import ERC20ABI from '../abi/ERC20';
import { STAKING_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../utils/constants';

// Approve tokens for staking
export const approve = async (signer, tokenAddress, amount) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);
    const value = ethers.parseEther(amount.toString());
    const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, value);
    toast.info('Approval transaction sent...');
    await tx.wait();
    toast.success('Approval successful!');
    return true;
  } catch (error) {
    console.error('Approve error:', error);
    toast.error('Error approving tokens: ' + (error.reason || error.message));
    return false;
  }
};

// Check allowance
export const checkAllowance = async (provider, tokenAddress, ownerAddress) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const allowance = await tokenContract.allowance(ownerAddress, STAKING_CONTRACT_ADDRESS);
    return allowance;
  } catch (error) {
    console.error('Check allowance error:', error);
    return BigInt(0);
  }
};

// Deposit/Stake tokens
export const stake = async (signer, poolId, amount) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const value = ethers.parseEther(amount.toString());
    const tx = await stakingContract.deposit(poolId, value);
    toast.info('Staking transaction sent...');
    await tx.wait();
    toast.success('Tokens staked successfully!');
    return true;
  } catch (error) {
    console.error('Stake error:', error);
    toast.error('Error staking tokens: ' + (error.reason || error.message));
    return false;
  }
};

// Withdraw/Unstake tokens
export const unstake = async (signer, poolId, amount) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const value = ethers.parseEther(amount.toString());
    const tx = await stakingContract.withdraw(poolId, value);
    toast.info('Withdrawal transaction sent...');
    await tx.wait();
    toast.success('Tokens withdrawn successfully!');
    return true;
  } catch (error) {
    console.error('Unstake error:', error);
    toast.error('Error withdrawing tokens: ' + (error.reason || error.message));
    return false;
  }
};

// Claim rewards
export const claimReward = async (signer, poolId) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const tx = await stakingContract.claimReward(poolId);
    toast.info('Claim transaction sent...');
    await tx.wait();
    toast.success('Rewards claimed successfully!');
    return true;
  } catch (error) {
    console.error('Claim error:', error);
    toast.error('Error claiming rewards: ' + (error.reason || error.message));
    return false;
  }
};

// Get pool info
export const getPoolInfo = async (provider, poolId) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, provider);
    const poolInfo = await stakingContract.poolInfo(poolId);
    return {
      depositToken: poolInfo[0],
      rewardToken: poolInfo[1],
      depositedAmount: poolInfo[2],
      apy: poolInfo[3],
      lockDays: poolInfo[4],
      rewardFund: poolInfo[5]
    };
  } catch (error) {
    console.error('Get pool info error:', error);
    return null;
  }
};

// Get pool count
export const getPoolCount = async (provider) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, provider);
    const count = await stakingContract.poolCount();
    return Number(count);
  } catch (error) {
    console.error('Get pool count error:', error);
    return 0;
  }
};

// Get all pools
export const getAllPools = async (provider) => {
  try {
    const count = await getPoolCount(provider);
    const pools = [];
    for (let i = 0; i < count; i++) {
      const pool = await getPoolInfo(provider, i);
      if (pool) {
        pools.push({ ...pool, poolId: i });
      }
    }
    return pools;
  } catch (error) {
    console.error('Get all pools error:', error);
    return [];
  }
};

// Get user staking info
export const getUserStakingInfo = async (provider, account, poolId) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, provider);
    const userInfo = await stakingContract.userInfo(poolId, account);
    const pendingReward = await stakingContract.pendingReward(poolId, account);
    return {
      amount: userInfo[0],
      lastRewardAt: userInfo[1],
      lockUntil: userInfo[2],
      pendingReward
    };
  } catch (error) {
    console.error('Get user staking info error:', error);
    return {
      amount: BigInt(0),
      lastRewardAt: BigInt(0),
      lockUntil: BigInt(0),
      pendingReward: BigInt(0)
    };
  }
};

// Get token balance
export const getTokenBalance = async (provider, tokenAddress, account) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const balance = await tokenContract.balanceOf(account);
    return balance;
  } catch (error) {
    console.error('Get token balance error:', error);
    return BigInt(0);
  }
};

// Get token info
export const getTokenInfo = async (provider, tokenAddress) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals()
    ]);
    return { name, symbol, decimals };
  } catch (error) {
    console.error('Get token info error:', error);
    return { name: 'Unknown', symbol: 'UNK', decimals: 18 };
  }
};

// Admin: Add pool
export const addPool = async (signer, depositToken, rewardToken, apy, lockDays) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const tx = await stakingContract.addPool(depositToken, rewardToken, apy, lockDays);
    toast.info('Adding pool...');
    await tx.wait();
    toast.success('Pool added successfully!');
    return true;
  } catch (error) {
    console.error('Add pool error:', error);
    toast.error('Error adding pool: ' + (error.reason || error.message));
    return false;
  }
};

// Admin: Fund rewards
export const fundRewards = async (signer, poolId, amount) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const value = ethers.parseEther(amount.toString());
    const tx = await stakingContract.fundRewards(poolId, value);
    toast.info('Funding rewards...');
    await tx.wait();
    toast.success('Rewards funded successfully!');
    return true;
  } catch (error) {
    console.error('Fund rewards error:', error);
    toast.error('Error funding rewards: ' + (error.reason || error.message));
    return false;
  }
};

// Admin: Modify pool APY
export const modifyPool = async (signer, poolId, newApy) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const tx = await stakingContract.modifyPool(poolId, newApy);
    toast.info('Modifying pool...');
    await tx.wait();
    toast.success('Pool modified successfully!');
    return true;
  } catch (error) {
    console.error('Modify pool error:', error);
    toast.error('Error modifying pool: ' + (error.reason || error.message));
    return false;
  }
};

// Get contract owner
export const getOwner = async (provider) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, provider);
    return await stakingContract.owner();
  } catch (error) {
    console.error('Get owner error:', error);
    return null;
  }
};
