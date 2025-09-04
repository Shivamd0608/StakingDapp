// context/constants.js
import { ethers } from "ethers";
import StakingDappABI from "./StakingDapp.json";
import TokenICO from "./TokenICO.json";
import CustomTokenABI from "./ERC20.json";

// ENV
export const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
export const TOKEN_ICO_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ICO;
export const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
export const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;
export const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;

// ---------- helpers ----------
export function ensureEthereum() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed or window.ethereum unavailable");
  }
}

export function provider() {
  ensureEthereum();
  return new ethers.providers.Web3Provider(window.ethereum);
}

export async function signer() {
  const p = provider();
  return p.getSigner();
}

export function toEth(amount, decimals = 18) {
  try {
    return ethers.utils.formatUnits(amount, decimals).toString();
  } catch {
    return "0";
  }
}

export function toWei(amount, decimals = 18) {
  return ethers.utils.parseUnits(amount?.toString() || "0", decimals);
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
  const s = await signer();
  return new ethers.Contract(STAKING_DAPP_ADDRESS, StakingDappABI.abi, s);
}

export async function loadTokenIcoContract() {
  const s = await signer();
  return new ethers.Contract(TOKEN_ICO_ADDRESS, TokenICO.abi, s);
}

export async function getERC20(address) {
  const s = await signer();
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
    userAddress ? c.balanceOf(userAddress) : Promise.resolve(ethers.constants.Zero),
    STAKING_DAPP_ADDRESS
      ? c.balanceOf(STAKING_DAPP_ADDRESS)
      : Promise.resolve(ethers.constants.Zero),
  ]);

  return {
    name,
    symbol,
    decimals,
    address: c.address,
    totalSupply: toEth(totalSupplyBN, decimals),
    balance: toEth(userBalBN, decimals),
    contractTokenBalance: toEth(stakingBalBN, decimals),
  };
}
