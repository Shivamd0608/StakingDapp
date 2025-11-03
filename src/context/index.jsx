// context/index.js
import { ethers } from "ethers";
import CustomTokenABI from "../abi/ERC20.json";
import { loadStakingContract } from "./constants";

// ---------------------
// Re-exports for UI compatibility
// ---------------------
export {
  STAKING_DAPP_ADDRESS,
  DEPOSIT_TOKEN,
  REWARD_TOKEN,
  TOKEN_LOGO,
  toEth,
  toWei,
} from "./constants";

export {
  CONTRACT_DATA,
  deposit,
  withdraw,
  claimReward,
  createPool,
  modifyPool,
  sweep,
  EMERGENCY_WITHDRAW,
  GET_USER_INFO,
} from "./staking";

export {
  transferToken,
  addTokenMetaMask,
  ERC20_BALANCE_OF,
  ERC20_ALLOWANCE,
  ERC20_APPROVE,
  loadERC20Info,
} from "./erc20";

export {
  LOAD_TOKEN_ICO,
  BUY_TOKEN,
  TOKEN_WITHDRAW,
  UPDATE_TOKEN,
  UPDATE_TOKEN_PRICE,
} from "./ico";

// ---------------------
// ADMIN FUNCTIONS
// ---------------------

// Approve reward token for Staking Contract (admin must call this before fundRewards)
export const approveRewardToken = async (rewardTokenAddress, amount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const rewardToken = new ethers.Contract(
      rewardTokenAddress,
      CustomTokenABI.abi,
      signer
    );

    const tx = await rewardToken.approve(
      import.meta.env.VITE_STAKING_DAPP, // staking contract address
      ethers.parseUnits(amount.toString(), 18)
    );

    await tx.wait();
    console.log("✅ Reward token approved successfully!");
    return true;
  } catch (error) {
    console.error("❌ approveRewardToken failed:", error);
    throw error;
  }
};

// Fund rewards into Staking contract
export const fundRewards = async (pid, amount) => {
  try {
    const staking = await loadStakingContract();
    const tx = await staking.fundRewards(
      pid,
      ethers.parseUnits(amount.toString(), 18)
    );

    await tx.wait();
    console.log("✅ Rewards funded successfully!");
    return true;
  } catch (error) {
    console.error("❌ fundRewards failed:", error);
    throw error;
  }
};