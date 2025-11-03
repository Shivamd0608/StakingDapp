import { ethers } from 'ethers';

export const formatBalance = (balance, decimals = 18) => {
  return parseFloat(ethers.utils.formatUnits(balance, decimals)).toFixed(4);
};

export const parseAmount = (amount, decimals = 18) => {
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
