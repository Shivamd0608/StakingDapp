import React from "react";

export default function TokenCard({ token, onTransfer, onApprove }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow mb-4">
      <h3 className="font-bold">{token.symbol}</h3>
      <p>Name: {token.name}</p>
      <p>Balance: {token.balance}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onTransfer}
          className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Transfer
        </button>
        <button
          onClick={onApprove}
          className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
