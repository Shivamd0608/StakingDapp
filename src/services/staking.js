
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import StakingDappABI from '../abi/StakingDapp';
import ERC20ABI from '../abi/ERC20';
import { STAKING_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../utils/constants';

export const approve = async (signer, amount) => {
  try {
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20ABI, signer);
    const value = ethers.utils.parseEther(amount.toString());
    const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, value);
    await tx.wait();
    toast.success('Approval successful!');
  } catch (error) {
    toast.error('Error approving tokens: ' + error.message);
  }
};

export const stake = async (signer, poolId, amount) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const value = ethers.utils.parseEther(amount.toString());
    const tx = await stakingContract.deposit(poolId, value);
    await tx.wait();
    toast.success('Tokens staked successfully!');
  } catch (error) {
    toast.error('Error staking tokens: ' + error.message);
  }
};

export const unstake = async (signer, poolId, amount) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const value = ethers.utils.parseEther(amount.toString());
    const tx = await stakingContract.withdraw(poolId, value);
    await tx.wait();
    toast.success('Tokens unstaked successfully!');
  } catch (error) {
    toast.error('Error unstaking tokens: ' + error.message);
  }
};

export const claimReward = async (signer, poolId) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const tx = await stakingContract.claim(poolId);
    await tx.wait();
    toast.success('Rewards claimed successfully!');
  } catch (error) {
    toast.error('Error claiming rewards: ' + error.message);
  }
};

export const getPoolInfo = async (provider, poolId) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, provider);
    return await stakingContract.poolInfo(poolId);
  } catch (error) {
    toast.error('Error fetching pool info: ' + error.message);
    return null;
  }
};

export const getUserStakingInfo = async (provider, account, poolId) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, provider);
    const userInfo = await stakingContract.userInfo(poolId, account);
    const pendingReward = await stakingContract.pendingReward(poolId, account);
    return { userInfo, pendingReward };
  } catch (error) {
    toast.error('Error fetching user staking info: ' + error.message);
    return { userInfo: null, pendingReward: null };
  }
};

export const addPool = async (signer, lpToken, allocPoint) => {
  try {
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingDappABI, signer);
    const tx = await stakingContract.add(lpToken, allocPoint, true);
    await tx.wait();
    toast.success('Pool added successfully!');
  } catch (error) {
    toast.error('Error adding pool: ' + error.message);
  }
};
