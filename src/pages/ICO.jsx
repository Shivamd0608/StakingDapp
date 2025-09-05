// src/pages/ICO.jsx
import React, { useEffect, useState } from "react";
import { LOAD_TOKEN_ICO, BUY_TOKEN, UPDATE_TOKEN_PRICE, UPDATE_TOKEN } from "../context";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

export default function ICO() {
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await LOAD_TOKEN_ICO();
      setData(res);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load ICO data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const buy = async () => {
    const amount = prompt("How many tokens to buy?", "1");
    if (!amount) return;
    try {
      await BUY_TOKEN(amount);
      toast.success("Buy tx submitted");
      load();
    } catch (e) {
      toast.error("Buy failed");
    }
  };

  const setPrice = async () => {
    const price = prompt("Set new price in ETH (e.g., 0.01):", "0.01");
    if (!price) return;
    try {
      await UPDATE_TOKEN_PRICE(price);
      toast.success("Price updated");
      load();
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const setToken = async () => {
    const addr = prompt("New token address:");
    if (!addr) return;
    try {
      await UPDATE_TOKEN(addr);
      toast.success("Token updated");
      load();
    } catch (e) {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-3">Token Sale (ICO)</h1>

      {loading && <div>Loading ICO data...</div>}

      {data && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-md p-4">
            <div className="text-sm text-slate-400">Owner</div>
            <div className="font-mono">{data.owner}</div>

            <div className="mt-4">
              <div className="text-sm text-slate-400">Token Price (ETH per token)</div>
              <div className="font-semibold">{data.tokenPrice}</div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-slate-400">Sold Tokens</div>
              <div className="font-semibold">{data.soldTokens}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={buy} className="px-3 py-2 bg-indigo-600 rounded-md">Buy Token</button>
              <button onClick={setPrice} className="px-3 py-2 bg-slate-600 rounded-md">Update Price (admin)</button>
              <button onClick={setToken} className="px-3 py-2 bg-slate-600 rounded-md">Update Token (admin)</button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-md p-4">
            <div className="text-sm text-slate-400">Token</div>
            {data.token ? (
              <div>
                <div className="font-semibold">{data.token.name} ({data.token.symbol})</div>
                <div className="text-sm text-slate-400">Decimals: {data.token.decimals}</div>
                <div className="text-sm text-slate-400">Supply: {data.token.Supply}</div>
                <div className="text-sm text-slate-400">ICO balance: {data.token.balance}</div>
              </div>
            ) : <div>No token set</div>}
          </div>
        </div>
      )}
    </div>
  );
}
