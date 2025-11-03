import React, { useState, useEffect } from 'react';
import { useICO } from '../hooks/useICO';

function ICOPage() {
  const { buyTokens, getUserTokenBalance, getICOInfo, startICO, stopICO, withdrawICOFunds } = useICO();
  const [ethAmount, setEthAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [icoInfo, setIcoInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const balance = await getUserTokenBalance();
      setTokenBalance(balance);
      const info = await getICOInfo();
      setIcoInfo(info);
    };
    fetchData();
  }, [getUserTokenBalance, getICOInfo]);

  const handleBuyTokens = async () => {
    if (!ethAmount) return;
    await buyTokens(ethAmount);
    setEthAmount('');
  };

  return (
    <div>
      <h2>ICO</h2>
      <p>Your Token Balance: {tokenBalance}</p>
      <div>
        <h3>ICO Info</h3>
        <p>Token Price: {icoInfo.tokenPrice?.toString()}</p>
        <p>Tokens Sold: {icoInfo.tokensSold?.toString()}</p>
        <p>Start Time: {new Date(icoInfo.startTime * 1000).toLocaleString()}</p>
        <p>End Time: {new Date(icoInfo.endTime * 1000).toLocaleString()}</p>
      </div>
      <div className="form">
        <input
          type="text"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="ETH Amount"
        />
        <button onClick={handleBuyTokens}>Buy Tokens</button>
      </div>
      <div className="admin-section">
        <h3>Admin</h3>
        <button onClick={startICO}>Start ICO</button>
        <button onClick={stopICO}>Stop ICO</button>
        <button onClick={withdrawICOFunds}>Withdraw Funds</button>
      </div>
    </div>
  );
}

export default ICOPage;