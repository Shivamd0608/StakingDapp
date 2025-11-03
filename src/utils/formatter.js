import { ethers } from 'ethers';

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (value) => {
  if (!value) return '0';
  return ethers.formatEther(value);
};