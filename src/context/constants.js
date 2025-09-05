// context/constants.js
import { ethers, BrowserProvider, formatUnits, parseUnits } from "ethers";
import StakingDappABI from "../abi/StakingDapp.json";
import TokenICO from "../abi/TokenICO.json";
import CustomTokenABI from "../abi/ERC20.json";

// ---------- ENV ----------
export const STAKING_DAPP_ADDRESS = import.meta.env.VITE_STAKING_DAPP;
export const TOKEN_ICO_ADDRESS   = import.meta.env.VITE_TOKEN_ICO;
export const DEPOSIT_TOKEN       = import.meta.env.VITE_DEPOSIT_TOKEN;
export const REWARD_TOKEN        = import.meta.env.VITE_REWARD_TOKEN;
export const TOKEN_LOGO          = import.meta.env.VITE_TOKEN_LOGO;

// ---------- helpers ----------
export function ensureEthereum() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed or window.ethereum unavailable");
  }
}

// Return a fresh provider
export function getProvider() {
  ensureEthereum();
  return new BrowserProvider(window.ethereum);
}

// Return a signer (wallet connection must be active)
export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

export function toEth(amount, decimals = 18) {
  try {
    return formatUnits(amount, decimals).toString();
  } catch {
    return "0";
  }
}

export function toWei(amount, decimals = 18) {
  return parseUnits(amount?.toString() || "0", decimals);
}

export function parseError(e) {
  try {
    const json = JSON.parse(JSON.stringify(e));
    return json?.reason || json?.error?.message || e?.message || "Unknown error";
  } catch {
    return e?.message || "Unknown error";
  }
}

// ---------- generic contract loaders ----------
export async function loadStakingContract() {
  const s = await getSigner();
  return new ethers.Contract(STAKING_DAPP_ADDRESS, StakingDappABI.abi, s);
}

export async function loadTokenIcoContract() {
  const s = await getSigner();
  return new ethers.Contract(TOKEN_ICO_ADDRESS, TokenICO.abi, s);
}

export async function getERC20(address) {
  const s = await getSigner();
  return new ethers.Contract(address, CustomTokenABI.abi, s);
}

// Returns rich ERC20 info (auto-decimals) + balances
export async function ERC20Rich(address, userAddress) {
  const c = await getERC20(address);
  const [name, symbol, decimals] = await Promise.all([
    c.name(),
    c.symbol(),
    c.decimals(),
  ]);

  const [totalSupplyBN, userBalBN, stakingBalBN] = await Promise.all([
    c.totalSupply(),
    userAddress ? c.balanceOf(userAddress) : Promise.resolve(0n),
    STAKING_DAPP_ADDRESS
      ? c.balanceOf(STAKING_DAPP_ADDRESS)
      : Promise.resolve(0n),
  ]);

  return {
    name,
    symbol,
    decimals,
    address: c.target, // ethers v6 uses `target` instead of `address`
    totalSupply: toEth(totalSupplyBN, decimals),
    balance: toEth(userBalBN, decimals),
    contractTokenBalance: toEth(stakingBalBN, decimals),
  };
}
