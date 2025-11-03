import React, { useState, useEffect } from 'react';
import { useWallet } from './context/WalletProvider';
import Staking from './pages/Staking';
import Admin from './pages/Admin';
import ICO from './pages/ICO';
import PoolCard from './components/PoolCard';
import UserStats from './components/UserStats';
import { CONTRACT_DATA } from './context/staking';

function App() {
  const { account, connectWallet, disconnectWallet } = useWallet();
  const [page, setPage] = useState('staking');
  const [pools, setPools] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (account) {
        const data = await CONTRACT_DATA(account);
        setPools(data.poolInfoArray);
        const totalStaked = data.poolInfoArray.reduce((acc, pool) => acc + parseFloat(pool.amount), 0);
        const totalRewards = data.poolInfoArray.reduce((acc, pool) => acc + parseFloat(pool.userReward), 0);
        setUserStats({
          stakedAmount: totalStaked,
          pendingRewards: totalRewards,
          lockTimeRemaining: data.poolInfoArray[0]?.lockUntil, // This might need adjustment depending on the desired logic
        });
      }
    }
    fetchData();
  }, [account]);

  return (
    <div>
      <nav>
        <button onClick={() => setPage('staking')}>Staking</button>
        <button onClick={() => setPage('admin')}>Admin</button>
        <button onClick={() => setPage('ico')}>ICO</button>
        {account ? (
          <div>
            <p>Connected: {account}</p>
            <button onClick={disconnectWallet}>Disconnect</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </nav>

      {page === 'staking' && (
        <div>
          <Staking />
          <h2>Available Pools</h2>
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
          <UserStats userStats={userStats} />
        </div>
      )}
      {page === 'admin' && <Admin />}
      {page === 'ico' && <ICO />}
    </div>
  );
}

export default App;