const TokenICOABI = [
  // Read functions
  "function tokenPrice() view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function startTime() view returns (uint256)",
  "function endTime() view returns (uint256)",
  
  // Write functions
  "function buyTokens() external payable",
  
  // Events
  "event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost)",
  "event ICOStarted(uint256 startTime)",
  "event ICOEnded(uint256 endTime)"
];

export default TokenICOABI;
