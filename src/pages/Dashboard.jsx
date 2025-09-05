// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { CONTRACT_DATA } from "../context";
import TokenCard from "../components/ui/TokenCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await CONTRACT_DATA(); // passing undefined fetches user-agnostic info
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-md p-4">
          <div className="text-sm text-slate-400">Total Deposited</div>
          <div className="font-semibold text-xl">{data?.totalDepositAmount ?? "—"}</div>
        </div>

        <div className="bg-slate-800 rounded-md p-4">
          <div className="text-sm text-slate-400">Contract Token Balance</div>
          <div className="font-semibold text-xl">{data?.contractTokenBalance ?? "—"}</div>
        </div>

        <div className="bg-slate-800 rounded-md p-4">
          <div className="text-sm text-slate-400">Contract Address</div>
          <div className="font-mono text-xs">{data?.contractAddress ?? "—"}</div>
        </div>
      </div>

      <h2 className="text-xl mb-2">Tokens</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {data?.depositToken && <TokenCard token={data.depositToken} />}
        {data?.rewardToken && <TokenCard token={data.rewardToken} />}
      </div>

      <h2 className="text-xl mb-2">Recent Notifications</h2>
      <div>
        {(data?.notifications || []).slice(0, 6).map((n, i) => (
          <div key={i} className="bg-slate-800 p-3 rounded-md mb-2">
            <div className="text-sm">{n.typeOf} by {n.user}</div>
            <div className="text-xs text-slate-400">{n.timeStamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
