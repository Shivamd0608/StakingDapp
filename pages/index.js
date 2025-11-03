import { ConnectButton } from '../src/components/ConnectButton';
import { ICODashboard } from '../src/components/ICODashboard';
import { StakingDashboard } from '../src/components/StakingDashboard';
import { useWeb3 } from '../src/context/Web3Context';

export default function Home() {
  const { isConnected } = useWeb3();

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Staking DApp</h1>
        <ConnectButton />
      </nav>

      {isConnected ? (
        <div className="grid md:grid-cols-2 gap-8">
          <ICODashboard />
          <StakingDashboard />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl">Connect your wallet to get started</p>
        </div>
      )}
    </div>
  );
}
