// context/erc20.js
import { ethers } from "ethers";
import {
  getERC20,
  ERC20Rich,
  toWei,
  parseError,
  TOKEN_LOGO,
} from "./constants";
import toast from "react-hot-toast";

const ok = (m) => toast.success(m, { duration: 2000 });
const err = (m) => toast.error(m, { duration: 2000 });

// ---- high-level read helper (used by CONTRACT_DATA, ICO loader) ----
export async function loadERC20Info(address, userAddress) {
  return ERC20Rich(address, userAddress);
}

// ---- wrappers ----
export async function ERC20_BALANCE_OF(tokenAddress, account) {
  try {
    const c = await getERC20(tokenAddress);
    const decimals = await c.decimals();
    const bal = await c.balanceOf(account);
    return ethers.formatUnits(bal, decimals);
  } catch (e) {
    throw new Error(parseError(e));
  }
}

export async function ERC20_ALLOWANCE(tokenAddress, owner, spender) {
  try {
    const c = await getERC20(tokenAddress);
    const decimals = await c.decimals();
    const a = await c.allowance(owner, spender);
    return ethers.formatUnits(a, decimals);
  } catch (e) {
    throw new Error(parseError(e));
  }
}

export async function ERC20_APPROVE(tokenAddress, spender, amountHuman) {
  try {
    const c = await getERC20(tokenAddress);
    const decimals = await c.decimals();
    const amount = toWei(amountHuman, decimals);
    const gas = await c.estimateGas.approve(spender, amount);
    const tx = await c.approve(spender, amount, { gasLimit: gas });
    ok("Approval submitted");
    return await tx.wait();
  } catch (e) {
    const m = parseError(e);
    err(m);
    throw new Error(m);
  }
}

export async function transferToken(tokenAddress, amountHuman, toAddress) {
  try {
    ok("calling contract token..");
    const c = await getERC20(tokenAddress);
    const decimals = await c.decimals();
    const amount = toWei(amountHuman, decimals);
    const gas = await c.estimateGas.transfer(toAddress, amount);
    const tx = await c.transfer(toAddress, amount, { gasLimit: gas });
    await tx.wait();
    ok("token transfer successfully");
  } catch (e) {
    const m = parseError(e);
    err(m);
  }
}

// Add to MetaMask
export const addTokenMetaMask = async (loadTokenContractFn) => {
  try {
    if (!window.ethereum) return err("MetaMask is not installed ");

    const contract = await loadTokenContractFn();
    const decimals = await contract.decimals();
    const tokenAddress = contract.target ?? contract.address;
    const symbol = await contract.symbol();
    const image = TOKEN_LOGO;

    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol,
          decimals,
          image,
        },
      },
    });

    wasAdded ? ok("Token Added") : err("Failed to add token");
  } catch (e) {
    err("Failed to add token");
  }
};
