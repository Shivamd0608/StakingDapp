// src/components/ui/PoolCard.jsx
import React from "react";

export default function PoolCard({ index, pool, onStake, onWithdraw, onClaim }) {
  return (
    <div className="bg-slate-800 rounded-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{pool.depositToken.symbol} Pool (#{index})</div>
          <div className="text-sm text-slate-400">APY: {pool.apy}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total deposited</div>
          <div className="font-semibold">{pool.depositedAmount}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-slate-400">Your amount</div>
          <div className="font-medium">{pool.amount}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Your rewards</div>
          <div className="font-medium">{pool.userReward}</div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="px-3 py-1 bg-indigo-600 rounded-md" onClick={() => onStake(index)}>Stake</button>
          <button className="px-3 py-1 bg-slate-600 rounded-md" onClick={() => onWithdraw(index)}>Withdraw</button>
          <button className="px-3 py-1 bg-emerald-600 rounded-md" onClick={() => onClaim(index)}>Claim</button>
        </div>
      </div>
    </div>
  );
}
