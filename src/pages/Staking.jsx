// src/pages/Staking.jsx
import React, { useEffect, useState } from "react";
import { CONTRACT_DATA, deposit, withdraw, claimReward } from "../context";
import PoolCard from "../components/ui/PoolCard";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

export default function Staking() {
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await CONTRACT_DATA(address);
      setData(res);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load staking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleStake = async (idx) => {
    const amount = prompt("Enter amount to stake (human amount):", "1");
    if (!amount) return;
    try {
      await deposit(idx, amount, address);
      toast.success("Stake tx completed");
      load();
    } catch (e) {
      toast.error("Stake failed");
    }
  };

  const handleWithdraw = async (idx) => {
    const amount = prompt("Enter amount to withdraw (human amount):", "1");
    if (!amount) return;
    try {
      await withdraw(idx, amount);
      toast.success("Withdraw tx completed");
      load();
    } catch (e) {
      toast.error("Withdraw failed");
    }
  };

  const handleClaim = async (idx) => {
    try {
      await claimReward(idx);
      toast.success("Claim tx completed");
      load();
    } catch (e) {
      toast.error("Claim failed");
    }
  };

  if (loading) return <div>Loading pools...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Staking Pools</h1>
        <div className="text-sm text-slate-400">Connected: {address ? address.slice(0,6) + "..." + address.slice(-4) : "No wallet"}</div>
      </div>

      <div>
        {(data?.poolInfoArray || []).map((p, idx) => (
          <PoolCard
            key={idx}
            index={idx}
            pool={p}
            onStake={handleStake}
            onWithdraw={handleWithdraw}
            onClaim={handleClaim}
          />
        ))}
      </div>
    </div>
  );
}
