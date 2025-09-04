// context/index.js
// re-export helpers and keep your original function names so UI doesn't break

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
  EMERGENCY_WITHDRAW,   // NEW
  GET_USER_INFO,        // NEW
} from "./staking";

export {
  transferToken,
  addTokenMetaMask,
  ERC20_BALANCE_OF,     // NEW
  ERC20_ALLOWANCE,      // NEW
  ERC20_APPROVE,        // NEW
  loadERC20Info,        // NEW
} from "./erc20";

export {
  LOAD_TOKEN_ICO,       // fixed & improved
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const rewardToken = new ethers.Contract(
      rewardTokenAddress,
      CustomTokenABI.abi,
      signer
    );

    const tx = await rewardToken.approve(
      process.env.NEXT_PUBLIC_STAKING_DAPP, // staking contract address
      ethers.utils.parseUnits(amount.toString(), 18)
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
    const staking = await contract(); // your staking contract helper
    const tx = await staking.fundRewards(
      pid,
      ethers.utils.parseUnits(amount.toString(), 18)
    );

    await tx.wait();
    console.log("✅ Rewards funded successfully!");
    return true;
  } catch (error) {
    console.error("❌ fundRewards failed:", error);
    throw error;
  }
};
