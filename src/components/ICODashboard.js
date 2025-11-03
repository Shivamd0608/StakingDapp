import React, { useState, useEffect } from 'react';
import { useContracts } from '../context/ContractContext';
import { useWeb3 } from '../context/Web3Context';
import { formatBalance } from '../utils/formatters';

export const ICODashboard = () => {
  const { ico } = useContracts();
  const { isConnected } = useWeb3();
  const [icoInfo, setIcoInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [buyAmount, setBuyAmount] = useState('');

  useEffect(() => {
    if (isConnected) {
      loadData();
    }
  }, [isConnected]);

  const loadData = async () => {
    const info = await ico.getICOInfo();
    const balance = await ico.getUserTokenBalance();
    setIcoInfo(info);
    setTokenBalance(balance);
  };

  const handleBuy = async () => {
    try {
      await ico.buyTokensETH(buyAmount);
      await loadData();
      setBuyAmount('');
    } catch (error) {
      console.error("Buy failed:", error);
    }
  };

  if (!isConnected) return <p>Please connect your wallet</p>;

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">ICO Dashboard</h2>
      
      <div className="space-y-4">
        <div>
          <p>Your Token Balance: {tokenBalance}</p>
          {icoInfo && (
            <>
              <p>Token Price: {formatBalance(icoInfo.tokenPrice)} ETH</p>
              <p>Total Sold: {formatBalance(icoInfo.totalSold)}</p>
            </>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="number"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            className="border p-2 rounded"
            placeholder="ETH Amount"
          />
          <button
            onClick={handleBuy}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buy Tokens
          </button>
        </div>
      </div>
    </div>
  );
};
