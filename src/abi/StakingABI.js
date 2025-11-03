const StakingABI = [
  // Staking functions
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function getReward() external",
  
  // View functions
  "function balanceOf(address account) external view returns (uint256)",
  "function earned(address account) external view returns (uint256)",
  "function totalStaked() external view returns (uint256)",
  "function rewardRate() external view returns (uint256)",

  // Events
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardPaid(address indexed user, uint256 reward)"
];

export default StakingABI;
