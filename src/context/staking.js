import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from '../config/contracts';
import StakingABI from "../abi/Staking";
import ERC20ABI from "../abi/ERC20";

const STAKING_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.STAKING;
const STAKING_TOKEN_ADDRESS = CONTRACT_ADDRESSES.STAKING_TOKEN;

class StakingManager {
  constructor() {
    this.stakingContract = null;
    this.stakingToken = null;
    this.provider = null;
    this.signer = null;
  }

  async init() {
    if (!window.ethereum) throw new Error("🦊 MetaMask not found");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    this.provider = provider;
    this.signer = signer;
    this.stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, StakingABI, signer);
    this.stakingToken = new ethers.Contract(STAKING_TOKEN_ADDRESS, ERC20ABI, provider);
  }

  async stake(amount) {
    try {
      if (!this.stakingContract) await this.init();
      const amountWei = ethers.utils.parseEther(amount.toString());
      
      // First approve tokens
      await this.stakingToken.connect(this.signer).approve(STAKING_CONTRACT_ADDRESS, amountWei);
      
      // Then stake
      const tx = await this.stakingContract.stake(amountWei);
      const receipt = await tx.wait();
      console.log("✅ Staking successful:", receipt);
      return receipt;
    } catch (error) {
      console.error("❌ Error in stake:", error);
      throw error;
    }
  }

  async unstake(amount) {
    try {
      if (!this.stakingContract) await this.init();
      const tx = await this.stakingContract.unstake(ethers.utils.parseEther(amount.toString()));
      const receipt = await tx.wait();
      console.log("✅ Unstake successful:", receipt);
      return receipt;
    } catch (error) {
      console.error("❌ Error in unstake:", error);
      throw error;
    }
  }

  async getStakingInfo() {
    try {
      if (!this.stakingContract) await this.init();
      const address = await this.signer.getAddress();
      
      const userStaked = await this.stakingContract.balanceOf(address);
      const earned = await this.stakingContract.earned(address);
      const totalStaked = await this.stakingContract.totalStaked();
      const rewardRate = await this.stakingContract.rewardRate();

      return {
        userStaked,
        earned,
        totalStaked,
        rewardRate
      };
    } catch (error) {
      console.error("❌ Error in getStakingInfo:", error);
      throw error;
    }
  }

  async claimRewards() {
    try {
      if (!this.stakingContract) await this.init();
      const tx = await this.stakingContract.getReward();
      const receipt = await tx.wait();
      console.log("✅ Rewards claimed:", receipt);
      return receipt;
    } catch (error) {
      console.error("❌ Error in claimRewards:", error);
      throw error;
    }
  }
}

const stakingManagerInstance = new StakingManager();

export const stakingManager = stakingManagerInstance;
export const stake = stakingManagerInstance.stake.bind(stakingManagerInstance);
export const unstake = stakingManagerInstance.unstake.bind(stakingManagerInstance);
export const getStakingInfo = stakingManagerInstance.getStakingInfo.bind(stakingManagerInstance);
export const claimRewards = stakingManagerInstance.claimRewards.bind(stakingManagerInstance);
