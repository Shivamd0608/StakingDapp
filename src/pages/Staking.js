import React, { useState, useEffect } from 'react';
import { useContracts } from '../context/ContractContext';
import { useWeb3 } from '../context/Web3Context';
import { StakingDashboard } from '../components/StakingDashboard';
import { ConnectButton } from '../components/ConnectButton';

const StakingPage = () => {
  const { isConnected } = useWeb3();
  const { staking } = useContracts();
  const [stakingData, setStakingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      loadStakingData();
    }
  }, [isConnected]);

  const loadStakingData = async () => {
    try {
      setLoading(true);
      const data = await staking.getStakingInfo();
      setStakingData(data);
    } catch (error) {
      console.error("Failed to load staking data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Staking Dashboard</h1>
        <ConnectButton />
      </div>

      {!isConnected ? (
        <div className="text-center py-10">
          <p className="text-xl">Please connect your wallet to view staking details</p>
        </div>
      ) : loading ? (
        <div className="text-center py-10">
          <p>Loading staking information...</p>
        </div>
      ) : (
        <StakingDashboard 
          stakingData={stakingData} 
          onStakingAction={loadStakingData}
        />
      )}
    </div>
  );
};

export default StakingPage;
