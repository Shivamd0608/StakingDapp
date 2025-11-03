const StakingABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function getReward() external",
  "function balanceOf(address account) external view returns (uint256)",
  "function earned(address account) external view returns (uint256)",
  "function totalStaked() external view returns (uint256)",
  "function rewardRate() external view returns (uint256)"
];

export default StakingABI;
