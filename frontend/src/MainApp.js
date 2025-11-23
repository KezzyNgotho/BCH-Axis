import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './App';
import InteractiveDashboard from './pages/Dashboard';
import ClientSignDemo from './pages/ClientSignDemo';
// import ConnectWallet from './components/ConnectWallet';

export default function MainApp() {
  const [wallet, setWallet] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bch_wallet') || 'null'); } catch (e) { return null; }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage wallet={wallet} setWallet={(w) => setWallet(w)} />} />
        <Route path="/dashboard" element={<InteractiveDashboard wallet={wallet || { address: 'No wallet', balance: 0, fiat: 0 }} vaults={[]} transactions={[]} />} />
        <Route path="/client-sign" element={<ClientSignDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
