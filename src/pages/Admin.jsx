// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { CONTRACT_DATA, approveRewardToken, fundRewards } from "../context";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

export default function Admin() {
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await CONTRACT_DATA(address);
      setData(res);
    } catch (e) {
      toast.error("Failed to load contract data");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const isOwner = data && address && data.contractOwner && data.contractOwner.toLowerCase() === address.toLowerCase();

  const doApproveReward = async () => {
    const tokenAddr = prompt("Reward token address:");
    const amount = prompt("Amount to approve (human):", "1000");
    if (!tokenAddr || !amount) return;
    try {
      await approveRewardToken(tokenAddr, amount);
      toast.success("Approved");
    } catch (e) {
      toast.error("Approve failed");
    }
  };

  const doFundRewards = async () => {
    const pid = prompt("Pool ID:");
    const amount = prompt("Amount to fund (human):", "1000");
    if (!pid || !amount) return;
    try {
      await fundRewards(pid, amount);
      toast.success("Rewards funded");
    } catch (e) {
      toast.error("Fund failed");
    }
  };

  if (loading) return <div>Loading admin...</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Admin</h1>

      {!isOwner && <div className="bg-amber-600 p-3 rounded-md mb-4">You are not contract owner. Admin controls are disabled.</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-md p-4">
          <div className="text-sm text-slate-400">Owner</div>
          <div className="font-mono">{data?.contractOwner ?? "—"}</div>
        </div>

        <div className="bg-slate-800 rounded-md p-4">
          <div className="flex gap-2">
            <button onClick={doApproveReward} disabled={!isOwner} className="px-3 py-2 bg-indigo-600 rounded-md disabled:opacity-50">Approve Reward Token</button>
            <button onClick={doFundRewards} disabled={!isOwner} className="px-3 py-2 bg-slate-600 rounded-md disabled:opacity-50">Fund Rewards</button>
          </div>
        </div>
      </div>
    </div>
  );
}
