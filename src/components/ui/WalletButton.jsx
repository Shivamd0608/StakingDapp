import React from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono bg-slate-800 px-3 py-1 rounded">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
        >
          {connector.name}
          {pendingConnector?.uid === connector.uid && " (connecting…)"}
        </button>
      ))}
    </div>
  );
}
