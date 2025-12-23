
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import TokenICOABI from '../abi/TokenICO';
import ERC20ABI from '../abi/ERC20';
import { ICO_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../utils/constants';

// Buy tokens from ICO
export const buyTokens = async (signer, tokenAmount) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    
    // Get token price to calculate ETH needed
    const tokenPrice = await icoContract.tokenSalePrice();
    const ethNeeded = BigInt(tokenAmount) * tokenPrice;
    
    const tx = await icoContract.buyToken(tokenAmount, { value: ethNeeded });
    toast.info('Purchase transaction sent...');
    await tx.wait();
    toast.success('Tokens purchased successfully!');
    return true;
  } catch (error) {
    console.error('Buy tokens error:', error);
    toast.error('Error purchasing tokens: ' + (error.reason || error.message));
    return false;
  }
};

// Get user token balance
export const getUserTokenBalance = async (provider, tokenAddress, account) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const balance = await tokenContract.balanceOf(account);
    return balance;
  } catch (error) {
    console.error('Get balance error:', error);
    return BigInt(0);
  }
};

// Get ICO token details
export const getICOInfo = async (provider) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, provider);
    const tokenDetails = await icoContract.gettokenDetails();
    const soldTokens = await icoContract.soldTokens();
    const owner = await icoContract.owner();
    
    return {
      name: tokenDetails[0],
      symbol: tokenDetails[1],
      balance: tokenDetails[2],
      supply: tokenDetails[3],
      tokenPrice: tokenDetails[4],
      tokenAddress: tokenDetails[5],
      soldTokens,
      owner
    };
  } catch (error) {
    console.error('Get ICO info error:', error);
    return null;
  }
};

// Admin: Update token address
export const updateToken = async (signer, tokenAddress) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const tx = await icoContract.updateToken(tokenAddress);
    toast.info('Updating token...');
    await tx.wait();
    toast.success('Token updated successfully!');
    return true;
  } catch (error) {
    console.error('Update token error:', error);
    toast.error('Error updating token: ' + (error.reason || error.message));
    return false;
  }
};

// Admin: Update token sale price
export const updateTokenSalePrice = async (signer, price) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const tx = await icoContract.updateTokenSalePrice(price);
    toast.info('Updating price...');
    await tx.wait();
    toast.success('Token price updated successfully!');
    return true;
  } catch (error) {
    console.error('Update price error:', error);
    toast.error('Error updating price: ' + (error.reason || error.message));
    return false;
  }
};

// Admin: Withdraw all tokens
export const withdrawAllTokens = async (signer) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, signer);
    const tx = await icoContract.withdrawAlltokens();
    toast.info('Withdrawing tokens...');
    await tx.wait();
    toast.success('Tokens withdrawn successfully!');
    return true;
  } catch (error) {
    console.error('Withdraw tokens error:', error);
    toast.error('Error withdrawing tokens: ' + (error.reason || error.message));
    return false;
  }
};

// Get ICO contract owner
export const getICOOwner = async (provider) => {
  try {
    const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, TokenICOABI, provider);
    return await icoContract.owner();
  } catch (error) {
    console.error('Get ICO owner error:', error);
    return null;
  }
};
