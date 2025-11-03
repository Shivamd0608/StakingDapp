// context/staking.js
import toast from "react-hot-toast";
import {
  loadStakingContract,
  getERC20,
  ERC20Rich,
  toEth,
  toWei,
  parseError,
  STAKING_DAPP_ADDRESS,
  DEPOSIT_TOKEN,
  REWARD_TOKEN,
} from "./constants";

// ---- Toast helpers ----
const ok = (m) => toast.success(m, { duration: 2000 });
const err = (m) => toast.error(m, { duration: 2000 });

// ---- Utility functions ----
export const safeBN = (val) => {
  if (val === undefined || val === null) return "0";
  try {
    // BigInt and ethers v6 return primitives that have toString()
    return typeof val.toString === "function" ? val.toString() : String(val);
  } catch {
    return String(val);
  }
};

export const safeNum = (val) => {
  if (val === undefined || val === null) return 0;
  try {
    // for BigInt or numeric types
    return typeof val === "bigint" ? Number(val) : Number(val);
  } catch {
    return 0;
  }
};

const tsToReadable = (seconds) => {
  const date = new Date(Number(seconds) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// ---- CONTRACT_DATA ----
export async function CONTRACT_DATA(address) {
  try {
    const staking = await loadStakingContract();

    // owner & address (ethers v6 contract target)
    const [contractOwner, contractAddress] = await Promise.all([
      staking.owner(),
      Promise.resolve(staking.target ?? staking.address ?? null),
    ]);

    // notifications
    const notificationsRaw = await staking.queryFilter("Notification");
    const notifications = await Promise.all(
      (notificationsRaw || []).map(async (event) => ({
        poolID: Number(event.args.poolID),
        amount: toEth(event.args.amount),
        user: event.args.user,
        typeOf: event.args.typeOf,
        timeStamp: tsToReadable(event.args.timestamp),
      }))
    );

    // pools
    const poolsCountRaw = await staking.poolCount();
    const poolsCount = Number(poolsCountRaw);
    const poolInfoArray = [];
    for (let i = 0; i < poolsCount; i++) {
      const p = await staking.poolInfo(i);
      const pending = await staking.pendingReward(i, address);

      // decimals-aware token metas
      const depositTokenInfo = await ERC20Rich(p.depositToken, address);
      const rewardTokenInfo = await ERC20Rich(p.rewardToken, address);

      const pool = {
        depositTokenAddress: p.depositToken,
        rewardTokenAddress: p.rewardToken,
        depositToken: depositTokenInfo,
        rewardToken: rewardTokenInfo,
        depositedAmount: safeBN(p.depositedAmount),
        apy: safeBN(p.apy),
        lockDays: safeBN(p.lockDays),

        // user
        amount: toEth(safeBN(pending?.amount ?? 0), depositTokenInfo.decimals),
        userReward: toEth(safeBN(pending?.reward ?? 0), rewardTokenInfo.decimals),

        // timestamps
        lockUntil: pending?.lockUntil ? tsToReadable(safeNum(pending.lockUntil)) : "N/A",
        lastRewardAt: pending?.lastRewardAt ? tsToReadable(safeNum(pending.lastRewardAt)) : "N/A",
      };

      poolInfoArray.push(pool);
    }

    const totalDepositAmount = poolInfoArray.reduce(
      (acc, p) => acc + parseFloat(p.depositedAmount || "0"),
      0
    );

    const rewardToken = await ERC20Rich(REWARD_TOKEN, address);
    const depositToken = await ERC20Rich(DEPOSIT_TOKEN, address);

    return {
      contractOwner,
      contractAddress,
      notifications: notifications.reverse(),
      rewardToken,
      depositToken,
      poolInfoArray,
      totalDepositAmount,
      contractTokenBalance:
        Number(depositToken.contractTokenBalance) - Number(totalDepositAmount || 0),
    };
  } catch (e) {
    console.error("CONTRACT_DATA error:", e);
    return parseError(e);
  }
}

// ---- Actions ----
export async function deposit(poolID, amountHuman, userAddress) {
  try {
    ok("calling contract ..");
    const staking = await loadStakingContract();

    const pool = await staking.poolInfo(Number(poolID));
    const erc20 = await getERC20(pool.depositToken);
    const decimals = await erc20.decimals();
    const amount = toWei(amountHuman, decimals);

    const allowance = await erc20.allowance(userAddress, staking.target ?? staking.address);
    // allowance and amount are BigInt in v6 — use numeric comparison
    if (allowance < amount) {
      ok("approving token ..");
      const txA = await erc20.approve(staking.target ?? staking.address, amount);
      await txA.wait();
    }

    const gas = await staking.estimateGas.deposit(Number(poolID), amount);
    const tx = await staking.deposit(Number(poolID), amount, { gasLimit: gas });
    const r = await tx.wait();
    ok("token stake successfully");
    return r;
  } catch (e) {
    err(parseError(e));
    // rethrow optional if caller expects promise rejection
    // throw e;
  }
}

export async function withdraw(poolID, amountHuman) {
  try {
    ok("calling contract ... ");
    const staking = await loadStakingContract();

    const pool = await staking.poolInfo(Number(poolID));
    const erc20 = await getERC20(pool.depositToken);
    const decimals = await erc20.decimals();
    const amount = toWei(amountHuman, decimals);

    const gas = await staking.estimateGas.withdraw(Number(poolID), amount);
    const tx = await staking.withdraw(Number(poolID), amount, { gasLimit: gas });
    const r = await tx.wait();
    ok("transactions successfully completed");
    return r;
  } catch (e) {
    err(parseError(e));
  }
}

export async function claimReward(poolID) {
  try {
    ok("calling contract ...");
    const staking = await loadStakingContract();
    const gas = await staking.estimateGas.claimReward(Number(poolID));
    const tx = await staking.claimReward(Number(poolID), { gasLimit: gas });
    const r = await tx.wait();
    ok("Reward claim successfully completed");
    return r;
  } catch (e) {
    err(parseError(e));
  }
}

export async function createPool(pool) {
  try {
    const { _depositToken, _rewardToken, _apy, _lockDays } = pool || {};
    if (!_depositToken || !_rewardToken || _apy == null || _lockDays == null) {
      return err("provide all the details");
    }
    ok("calling contract ...");
    const staking = await loadStakingContract();
    const gas = await staking.estimateGas.addPool(
      _depositToken,
      _rewardToken,
      Number(_apy),
      Number(_lockDays)
    );
    const tx = await staking.addPool(
      _depositToken,
      _rewardToken,
      Number(_apy),
      Number(_lockDays),
      { gasLimit: gas }
    );
    const r = await tx.wait();
    ok("Pool created successfully");
    return r;
  } catch (e) {
    err(parseError(e));
  }
}

export async function modifyPool(poolID, amountOrApy) {
  try {
    ok("calling contract ...");
    const staking = await loadStakingContract();
    const gas = await staking.estimateGas.modifyPool(Number(poolID), Number(amountOrApy));
    const tx = await staking.modifyPool(Number(poolID), Number(amountOrApy), { gasLimit: gas });
    const r = await tx.wait();
    ok("Pool modified successfully");
    return r;
  } catch (e) {
    err(parseError(e));
  }
}

export async function sweep(tokenAddress, amountHuman) {
  try {
    if (!tokenAddress || !amountHuman) return err("data is missing");
    ok("calling contract ...");
    const staking = await loadStakingContract();
    const erc20 = await getERC20(tokenAddress);
    const decimals = await erc20.decimals();
    const amount = toWei(amountHuman, decimals);

    const gas = await staking.estimateGas.sweep(tokenAddress, amount);
    const tx = await staking.sweep(tokenAddress, amount, { gasLimit: gas });
    const r = await tx.wait();
    ok("transaction completed successfully");
    return r;
  } catch (e) {
    err(parseError(e));
  }
}


export async function GET_USER_INFO(poolID, user) {
  try {
    const staking = await loadStakingContract();

    // prefer dedicated userInfo if available
    if (staking.userInfo) {
      const u = await staking.userInfo(Number(poolID), user);
      return {
        amount: u?.amount?.toString?.() ?? "0",
        lastRewardAt: u?.lastRewardAt ? Number(u.lastRewardAt) : 0,
        lockUntil: u?.lockUntil ? Number(u.lockUntil) : 0,
      };
    }

    const p = await staking.pendingReward(Number(poolID), user);
    return {
      amount: p?.amount?.toString?.() ?? "0",
      lastRewardAt: p?.lastRewardAt ? Number(p.lastRewardAt) : 0,
      lockUntil: p?.lockUntil ? Number(p.lockUntil) : 0,
    };
  } catch (e) {
    err(parseError(e));
    return { amount: "0", lastRewardAt: 0, lockUntil: 0 }; // safe fallback
  }
}