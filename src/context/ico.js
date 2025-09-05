// context/ico.js
import { ethers } from "ethers";
import toast from "react-hot-toast";
import {
  loadTokenIcoContract,
  getERC20,
  toEth,
  toWei,
  parseError,
} from "./constants";

const ok = (m) => toast.success(m, { duration: 2000 });
const err = (m) => toast.error(m, { duration: 2000 });

// normalize details from contract
async function readTokenDetails(ico) {
  let details;
  if (ico.getTokenDetails) details = await ico.getTokenDetails();
  else if (ico.gettokenDetails) details = await ico.gettokenDetails();
  else throw new Error("ICO contract: getTokenDetails() not found in ABI");

  return details;
}

// preload ICO data
export const LOAD_TOKEN_ICO = async () => {
  try {
    const ico = await loadTokenIcoContract();

    const [owner, soldTokensBN, details] = await Promise.all([
      ico.owner(),
      ico.soldTokens ? ico.soldTokens() : 0n,
      readTokenDetails(ico),
    ]);

    const tokenAddr =
      details.tokenAddress ||
      (ico.tokenAddress ? await ico.tokenAddress() : null);

    const tokenC = tokenAddr ? await getERC20(tokenAddr) : null;
    const tokenDecimals = tokenC ? await tokenC.decimals() : 18;

    const tokenMeta = tokenAddr
      ? {
          address: tokenAddr,
          name: details.name ?? (await tokenC.name()),
          symbol: details.symbol ?? (await tokenC.symbol()),
          decimals: tokenDecimals,
          Supply: toEth(details.supply ?? (await tokenC.totalSupply()), tokenDecimals),
          balance: toEth(
            details.balance ?? (await tokenC.balanceOf(ico.target ?? ico.address)),
            tokenDecimals
          ),
        }
      : null;

    return {
      owner: owner?.toLowerCase?.() || owner,
      soldTokens: Number(soldTokensBN),
      tokenPrice: toEth(details.tokenPrice, 18),
      token: tokenMeta,
    };
  } catch (e) {
    console.error(e);
    throw new Error(parseError(e));
  }
};

export const BUY_TOKEN = async (amountHuman) => {
  try {
    ok("calling ico contract");
    const ico = await loadTokenIcoContract();

    const details = await readTokenDetails(ico);

    const tokenPriceWei = details.tokenPrice; // BigInt
    const amountBN = BigInt(amountHuman);
    const totalCostWei = tokenPriceWei * amountBN;

    const gas = await ico.estimateGas.buyToken(amountBN, { value: totalCostWei });
    const tx = await ico.buyToken(amountBN, { value: totalCostWei, gasLimit: gas });
    const r = await tx.wait();
    ok("Transaction successfully completed");
    return r;
  } catch (e) {
    const m = parseError(e);
    err(m);
  }
};

export const TOKEN_WITHDRAW = async () => {
  try {
    ok("calling ico contract");
    const ico = await loadTokenIcoContract();
    const details = await readTokenDetails(ico);

    const tokenAddr =
      details.tokenAddress ||
      (ico.tokenAddress ? await ico.tokenAddress() : null);

    if (!tokenAddr) return err("token address not set");

    const tokenC = await getERC20(tokenAddr);
    const bal = await tokenC.balanceOf(ico.target ?? ico.address);
    if (bal <= 0n) return err("token balance is lower than expected");

    const gas = await ico.estimateGas.withdrawAllTokens();
    const tx = await ico.withdrawAllTokens({ gasLimit: gas });
    const r = await tx.wait();
    ok("Transaction successfully completed");
    return r;
  } catch (e) {
    const m = parseError(e);
    err(m);
  }
};

export const UPDATE_TOKEN = async (_address) => {
  try {
    if (!_address) return err("DATA is missing");
    const ico = await loadTokenIcoContract();
    const gas = await ico.estimateGas.updateToken(_address);
    const tx = await ico.updateToken(_address, { gasLimit: gas });
    const r = await tx.wait();
    ok("Transaction successfully completed");
    return r;
  } catch (e) {
    const m = parseError(e);
    err(m);
  }
};

export const UPDATE_TOKEN_PRICE = async (priceInEth) => {
  try {
    if (priceInEth == null) return err("DATA is missing");
    const ico = await loadTokenIcoContract();
    const priceWei = ethers.parseUnits(priceInEth.toString(), "ether");
    const gas = await ico.estimateGas.updateTokenSalePrice(priceWei);
    const tx = await ico.updateTokenSalePrice(priceWei, { gasLimit: gas });
    const r = await tx.wait();
    ok("Transaction successfully completed");
    return r;
  } catch (e) {
    const m = parseError(e);
    err(m);
  }
};
