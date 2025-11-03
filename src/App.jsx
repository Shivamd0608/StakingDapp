import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { EthersProvider } from './context/EthersContext';
import { ICOProvider } from './context/ICOContext.jsx';
import { StakingProvider } from './context/StakingContext';
import { Web3Provider } from './context/Web3Context.jsx';
import { ContractProvider } from './context/ContractContext.jsx';
import { useEthers } from './hooks/useEthers';
import WalletButton from './components/common/WalletButton';
import ICOPage from './pages/ICOPage';
import StakingPage from './pages/StakingPage';
import NotFound from './pages/NotFound';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { account } = useEthers();

  return (

<div className="app-container">
      <nav>
        <WalletButton />
        <div className="nav-links">
          <Link to="/ico">ICO</Link>
          <Link to="/staking">Staking</Link>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ico" />} />
          <Route path="/ico" element={account ? <ICOPage /> : <h1>Please connect your wallet</h1>} />
          <Route path="/staking" element={account ? <StakingPage /> : <h1>Please connect your wallet</h1>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <EthersProvider>
      <ICOProvider>
        <StakingProvider>
          <Router>
            <AppContent />
          </Router>
        </StakingProvider>
      </ICOProvider>
    </EthersProvider>
  );
}

// Optional app wrapper for src-level usage
export function AppWrapper({ Component, pageProps }) {
	return (
		<Web3Provider>
			<ContractProvider>
				<Component {...pageProps} />
			</ContractProvider>
		</Web3Provider>
	);
}

export default App;