import { ethers } from 'ethers';
import StakingABI from '../abi/StakingABI';
import TokenICO from '../abi/TokenICO';

export const getContracts = (signer) => {
  const stakingContract = new ethers.Contract(
    import.meta.env.VITE_STAKING_DAPP,
    StakingABI,
    signer
  );

  const icoContract = new ethers.Contract(
    import.meta.env.VITE_TOKEN_ICO,
    TokenICO,
    signer
  );

  return { stakingContract, icoContract };
};