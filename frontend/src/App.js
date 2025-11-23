import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/Landing';
import InteractiveDashboard from './pages/Dashboard';
import ClientSignDemo from './pages/ClientSignDemo';
import MerchantOnboard from './pages/MerchantOnboard';
import { WalletProvider } from './context/walletprovider';

function AppRoutes({ wallet, setWallet }) {
  const location = useLocation();
  const state = location.state && location.state.background;

  return (
    <>
      <Routes location={state || location}>
        <Route path="/" element={<LandingPage wallet={wallet} setWallet={setWallet} />} />

        <Route path="/dashboard" element={<InteractiveDashboard wallet={wallet || { address: 'No wallet', balance: 0, fiat: 0 }} vaults={[]} transactions={[]} />} />
        <Route path="/client-sign" element={<ClientSignDemo />} />
        {/* Ensure /merchant works as a full page when there's no background state */}
        <Route path="/merchant" element={<MerchantOnboard />} />
      </Routes>

      {/* Show merchant onboarding as modal when there is a background location */}
      {state && (
        <Routes>
          <Route path="/merchant" element={<MerchantOnboard />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  const [wallet, setWallet] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('bch_wallet') || 'null'); } catch (e) { return null; }
  });

  return (
    <WalletProvider>
    <BrowserRouter>
      <AppRoutes wallet={wallet} setWallet={setWallet} />
    </BrowserRouter>
    </WalletProvider>
  );
}