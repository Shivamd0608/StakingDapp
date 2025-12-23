import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { EthersProvider } from './context/EthersContext';
import { useEthers } from './hooks/useEthers';
import WalletButton from './components/common/WalletButton';
import ICOPage from './pages/ICOPage';
import StakingPage from './pages/StakingPage';
import NotFound from './pages/NotFound';
import 'react-toastify/dist/ReactToastify.css';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  );
}

function AppContent() {
  const { account } = useEthers();

  return (
    <div className="app-container">
      <nav>
        <Link to="/" className="nav-brand">🐉 StakingDapp</Link>
        <div className="nav-links">
          <NavLink to="/ico">ICO</NavLink>
          <NavLink to="/staking">Staking</NavLink>
        </div>
        <WalletButton />
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ico" />} />
          <Route 
            path="/ico" 
            element={
              account ? (
                <ICOPage />
              ) : (
                <div className="connect-message">
                  <h2>🔐 Connect Your Wallet</h2>
                  <p>Please connect your wallet to access the ICO</p>
                </div>
              )
            } 
          />
          <Route 
            path="/staking" 
            element={
              account ? (
                <StakingPage />
              ) : (
                <div className="connect-message">
                  <h2>🔐 Connect Your Wallet</h2>
                  <p>Please connect your wallet to access staking</p>
                </div>
              )
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

function App() {
  return (
    <EthersProvider>
      <Router>
        <AppContent />
      </Router>
    </EthersProvider>
  );
}

export default App;
