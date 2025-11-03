const ERC20ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export default ERC20ABI;
