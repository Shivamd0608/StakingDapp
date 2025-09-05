// src/pages/Tokens.jsx
import React, { useState } from "react";
import { transferToken, ERC20_APPROVE, ERC20_BALANCE_OF } from "../context";
import toast from "react-hot-toast";

export default function Tokens() {
  const [tokenAddr, setTokenAddr] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);

  const doTransfer = async () => {
    if (!tokenAddr || !toAddr || !amount) return toast.error("Missing data");
    try {
      await transferToken(tokenAddr, amount, toAddr);
      toast.success("Transfer completed");
    } catch (e) {
      toast.error("Transfer failed");
    }
  };

  const doApprove = async () => {
    const spender = prompt("Spender address:");
    if (!spender || !tokenAddr || !amount) return;
    try {
      await ERC20_APPROVE(tokenAddr, spender, amount);
      toast.success("Approved");
    } catch (e) {
      toast.error("Approve failed");
    }
  };

  const checkBalance = async () => {
    if (!tokenAddr) return toast.error("Provide token address");
    try {
      const b = await ERC20_BALANCE_OF(tokenAddr, window.ethereum?.selectedAddress || "");
      setBalance(b);
    } catch (e) {
      toast.error("Balance fetch failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">ERC20 Utilities</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-md p-4">
          <label className="block mb-2 text-sm">Token address</label>
          <input value={tokenAddr} onChange={(e)=>setTokenAddr(e.target.value)} className="w-full p-2 rounded-md bg-slate-700" />
          <label className="block mt-2 mb-2 text-sm">Recipient</label>
          <input value={toAddr} onChange={(e)=>setToAddr(e.target.value)} className="w-full p-2 rounded-md bg-slate-700" />
          <label className="block mt-2 mb-2 text-sm">Amount</label>
          <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full p-2 rounded-md bg-slate-700" />
          <div className="mt-3 flex gap-2">
            <button onClick={doTransfer} className="px-3 py-2 bg-indigo-600 rounded-md">Transfer</button>
            <button onClick={doApprove} className="px-3 py-2 bg-slate-600 rounded-md">Approve</button>
            <button onClick={checkBalance} className="px-3 py-2 bg-slate-600 rounded-md">Check Balance</button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-md p-4">
          <div className="text-sm text-slate-400">Balance</div>
          <div className="font-semibold">{balance ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
