
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import TokenICOABI from '../abi/TokenICO';
import ERC20ABI from '../abi/ERC20';
import { ICO_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../utils/constants';

export const buyTokens = async (signer, ethAmount) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const value = ethers.utils.parseEther(ethAmount.toString());
    const tx = await icoContract.buyTokens({ value });
    await tx.wait();
    toast.success('Tokens purchased successfully!');
  } catch (error) {
    toast.error('Error purchasing tokens: ' + error.message);
  }
};

export const getUserTokenBalance = async (provider, account) => {
  try {
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20ABI, provider);
    const balance = await tokenContract.balanceOf(account);
    const decimals = await tokenContract.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  } catch (error) {
    toast.error('Error fetching token balance: ' + error.message);
    return '0';
  }
};

export const getICOInfo = async (provider) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, provider);
    const tokenPrice = await icoContract.tokenPrice();
    const tokensSold = await icoContract.tokensSold();
    const startTime = await icoContract.startTime();
    const endTime = await icoContract.endTime();
    return { tokenPrice, tokensSold, startTime, endTime };
  } catch (error) {
    toast.error('Error fetching ICO info: ' + error.message);
    return {};
  }
};

export const startICO = async (signer) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const tx = await icoContract.startSale();
    await tx.wait();
    toast.success('ICO started successfully!');
  } catch (error) {
    toast.error('Error starting ICO: ' + error.message);
  }
};

export const stopICO = async (signer) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const tx = await icoContract.stopSale();
    await tx.wait();
    toast.success('ICO stopped successfully!');
  } catch (error) {
    toast.error('Error stopping ICO: ' + error.message);
  }
};

export const withdrawICOFunds = async (signer) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const tx = await icoContract.withdrawFunds();
    await tx.wait();
    toast.success('Funds withdrawn successfully!');
  } catch (error) {
    toast.error('Error withdrawing funds: ' + error.message);
  }
};
