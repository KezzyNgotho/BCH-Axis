"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCogs, FaGlobe, FaChartPie, FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";

import MerchantOverlay from './MerchantOnboard';
// import ConnectWallet from '../components/ConnectWallet';
import WalletModal from "../components/walletmodal";
import { useWallet } from "../context/walletprovider";


const THEME = {
  primary: "#1D546C",
  accent: "#3EA76A",
  light: "#EAF6F8",
  dark: "#07212a"
};

export default function LandingPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [merchantOpen, setMerchantOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Callback triggered by ConnectButton on successful wallet connection
  const handleWalletConnect = useCallback(() => {
    setWalletConnected(true);
    setMerchantOpen(true); // Open dashboard immediately after connecting
  }, []);

  // Removed useWallet and setModalOpen logic (not needed)

  const handleLaunchDashboard = () => {
    setMerchantOpen(true); // open your merchant overlay
  };


  return (
    <div style={styles.page}>
      <style>{globalStyles}</style>

      {/* TOP NAV */}
      <motion.nav style={styles.nav} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <div style={styles.brand}>BCH Axis</div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.link}>Features</a>
          <a href="#how" style={styles.link}>How it works</a>
          <a href="#pricing" style={styles.link}>Pricing</a>
          <a href="#roadmap" style={styles.link}>Roadmap</a>
          <a href="#about" style={styles.link}>About</a>
          <div style={styles.dropdown} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button style={styles.link}>Services ▾</button>
            {servicesOpen && (
              <div style={styles.dropdownContent}>
                <div style={styles.serviceItem} onClick={() => setActiveService("SmartContract")}> <FaCogs /> Smart Contract Management </div>
                <div style={styles.serviceItem} onClick={() => { setActiveService("MerchantOnboarding"); setMerchantOpen(true); }}> <FaGlobe /> Merchant Onboarding </div>
                <div style={styles.serviceItem} onClick={() => setActiveService("Analytics")}> <FaChartPie /> Analytics & Reporting </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(30,80,100,0.10)',
              padding: '32px 32px 24px 32px',
              minWidth: 340,
              maxWidth: 420,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <label htmlFor="walletAddress" style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: THEME.primary }}>
                Enter your BCH wallet address
              </label>
              <input
                id="walletAddress"
                type="text"
                style={{
                  width: '100%',
                  padding: '14px 12px',
                  marginBottom: 18,
                  fontSize: 17,
                  borderRadius: 8,
                  border: '1.5px solid #c3e2e7',
                  background: '#f7feff',
                  outline: 'none',
                  color: THEME.primary,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                  transition: 'border 0.2s',
                }}
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                placeholder="bitcoincash:... or chipnet:..."
              />
              <button
                style={{
                  marginTop: 4,
                  padding: '13px 0',
                  width: '100%',
                  fontSize: 17,
                  borderRadius: 8,
                  background: THEME.primary,
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: 1,
                  boxShadow: '0 2px 12px rgba(30,80,100,0.07)'
                }}
                onClick={handleLaunchDashboard}
              >
                Launch Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <header style={styles.hero}>
        <motion.div style={styles.heroText} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 style={styles.h1}>Accept Bitcoin Cash with Confidence</h1>
          <p style={styles.lead}>BCH Axis allows businesses to accept BCH, automate revenue splits, and manage cash flow with on-chain smart contracts. Your funds remain secure while scaling your operations effortlessly.</p>
          <div style={styles.heroButtons}>
            <button style={styles.primaryBtn} onClick={handleLaunchDashboard}> Launch Dashboard </button>
            <button style={styles.secondaryBtn}>View Demo</button>
          </div>
        </motion.div>
        <motion.div style={styles.heroVisual} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <div style={styles.logoOrb}>BCH Axis</div>
          <motion.div style={styles.coinOrb} animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} />
        </motion.div>
      </header>
              <WalletModal />

      {/* MERCHANT DASHBOARD */}
      <MerchantOverlay isOpen={merchantOpen} onClose={() => setMerchantOpen(false)} />

      {/* ACTIVE SERVICE */}
      {activeService && (
        <section style={styles.serviceDetail}>
          {activeService === "SmartContract" && (
            <div><h3>Smart Contract Management</h3><p>Automate revenue splits, schedule spending, and secure funds with BCH smart contracts.</p></div>
          )}
          {activeService === "MerchantOnboarding" && (
            <div><h3>Merchant Onboarding</h3><p>Quickly onboard merchants and branches with easy vault creation and management.</p></div>
          )}
          {activeService === "Analytics" && (
            <div><h3>Analytics & Reporting</h3><p>Track payments, visualize revenue, and get actionable insights in real-time.</p></div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>© {new Date().getFullYear()} BCH Axis</div>
        <div style={{marginTop:8}}>
          <FaTwitter style={{margin:'0 8px'}} />
          <FaLinkedin style={{margin:'0 8px'}} />
          <FaGithub style={{margin:'0 8px'}} />
          <FaEnvelope style={{margin:'0 8px'}} />
          <FaPhone style={{margin:'0 8px'}} />
        </div>
        <div style={{opacity:0.85, marginTop:8}}>Built for Blaze2025 • Bitcoin Cash</div>
      </footer>
    </div>
  );
}

// --- STYLES ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box}
  body,html,#root{height:100%}
`;

const styles = {
  page: { background: THEME.light, color: THEME.primary, fontFamily: 'Inter, system-ui, sans-serif' },
  nav: { height:70, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, background: 'rgba(255,255,255,0.95)', backdropFilter:'blur(8px)', zIndex:50 },
  brand: { fontWeight:800, fontSize:22, color:THEME.primary },
  navLinks: { display:'flex', gap:20, alignItems:'center' },
  link: { color:THEME.primary, textDecoration:'none', fontWeight:600, cursor:'pointer' },
  dropdown: { position:'relative', display:'inline-block' },
  dropdownContent: { position:'absolute', top:'100%', left:0, background:'#fff', minWidth:220, boxShadow:'0 8px 30px rgba(0,0,0,0.1)', borderRadius:12, padding:12, zIndex:20 },
  serviceItem: { padding:'8px 12px', display:'flex', alignItems:'center', gap:8, cursor:'pointer', borderRadius:6, fontWeight:600, color:THEME.primary, transition:'background 0.2s' },

  hero: { display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:'80px 60px', gap:40, position:'relative', minHeight:'72vh', background: `linear-gradient(180deg, ${THEME.light}, #f7feff)` },
  heroText: { maxWidth:600 },
  h1: { fontSize:52, marginBottom:24, color:THEME.primary },
  lead: { fontSize:20, marginBottom:32, lineHeight:1.6, color:'#164a58' },
  heroButtons: { display:'flex', gap:16 },
  primaryBtn: { background:THEME.primary, color:'#fff', border:'none', padding:'14px 28px', borderRadius:12, fontWeight:700, cursor:'pointer' },
  secondaryBtn: { background:'transparent', color:THEME.primary, border:`2px solid ${THEME.primary}`, padding:'12px 24px', borderRadius:12, fontWeight:700, cursor:'pointer' },
  heroVisual: { position:'relative', width:400, height:400, display:'flex', justifyContent:'center', alignItems:'center' },
  logoOrb: { width:320, height:320, borderRadius:9999, background:THEME.accent, display:'flex', justifyContent:'center', alignItems:'center', fontWeight:800, fontSize:24, color:'#fff', boxShadow:'0 0 50px rgba(62,167,106,0.5)' },
  coinOrb: { position:'absolute', width:100, height:100, borderRadius:9999, background:THEME.accent, top:-40, right:-40, boxShadow:'0 0 50px rgba(62,167,106,0.5)' },

  serviceDetail: { maxWidth: 900, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center', color: THEME.primary },

  footer: { padding:'40px 20px', background:'#07212a', color:'#fff', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }
};
