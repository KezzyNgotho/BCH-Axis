import React, { useEffect, useState } from "react";
import logo from "../public/logo.png";

export default function MerchantPortal() {
  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    // Example: Load merchant data from localStorage (customize as needed)
    const data = localStorage.getItem("merchant");
    if (data) setMerchant(JSON.parse(data));
  }, []);

  if (!merchant) {
    return (
      <div style={{padding: '48px', textAlign: 'center', color: '#888', fontFamily: 'Inter, system-ui, sans-serif'}}>
        <img src={logo} alt="Platform Logo" style={{height: 64, marginBottom: 24}} />
        <h2 style={{fontSize: 32, fontWeight: 800, color: '#1D546C'}}>Merchant Portal</h2>
        <p>No merchant data available. Please complete onboarding.</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '1200px', margin: '48px auto', background: '#fff', borderRadius: '2rem', boxShadow: '0 12px 48px rgba(62,167,106,0.10)', padding: '3rem 3.5rem', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative'}}>
      <img src={logo} alt="Platform Logo" style={{height: 72, position: 'absolute', top: 32, left: 32}} />
      <div style={{marginLeft: 120}}>
        <h1 style={{fontSize: 40, fontWeight: 900, color: '#1D546C', marginBottom: 8}}>Welcome, {merchant.name}</h1>
        <div style={{fontSize: 20, color: '#3EA76A', fontWeight: 700, marginBottom: 32}}>
          <span>Status: </span>
          {merchant.kycApproved ? (
            <span style={{color: '#3EA76A'}}>KYC Approved</span>
          ) : (
            <span style={{color: '#d32f2f'}}>KYC Pending</span>
          )}
        </div>
        {/* Profile Section */}
        <div style={{display: 'flex', alignItems: 'center', gap: '40px', marginBottom: 40}}>
          <div style={{flex: 1}}>
            <h4 style={{fontWeight: 700, color: '#164a58', fontSize: 18}}>Profile</h4>
            <div style={{background: '#EAF6F8', borderRadius: 12, padding: '22px', fontSize: 18, fontWeight: 600, color: '#164a58'}}>
              <p><strong>Merchant Name:</strong> {merchant.name}</p>
              <p><strong>Business Name:</strong> {merchant.businessName}</p>
              <p><strong>Email:</strong> {merchant.email}</p>
              <p><strong>Wallet (XPUB):</strong> <span style={{wordBreak: 'break-all'}}>{merchant.xpub}</span></p>
              <p><strong>API Key:</strong> <span style={{color: '#3EA76A'}}>{merchant.apiKey}</span></p>
            </div>
          </div>
          <div style={{flex: 1}}>
            <h4 style={{fontWeight: 700, color: '#164a58', fontSize: 18}}>Statistics</h4>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
              <div style={{background: '#F6FBF7', borderRadius: 10, padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(62,167,106,0.08)'}}>
                <div style={{fontSize: 32, fontWeight: 900, color: '#3EA76A'}}>0</div>
                <div style={{fontSize: 16, color: '#164a58', fontWeight: 600}}>Total Transactions</div>
              </div>
              <div style={{background: '#F6FBF7', borderRadius: 10, padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(62,167,106,0.08)'}}>
                <div style={{fontSize: 32, fontWeight: 900, color: '#3EA76A'}}>0</div>
                <div style={{fontSize: 16, color: '#164a58', fontWeight: 600}}>Total Revenue</div>
              </div>
              <div style={{background: '#F6FBF7', borderRadius: 10, padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(62,167,106,0.08)'}}>
                <div style={{fontSize: 32, fontWeight: 900, color: '#3EA76A'}}>0</div>
                <div style={{fontSize: 16, color: '#164a58', fontWeight: 600}}>Active Invoices</div>
              </div>
              <div style={{background: '#F6FBF7', borderRadius: 10, padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(62,167,106,0.08)'}}>
                <div style={{fontSize: 32, fontWeight: 900, color: '#3EA76A'}}>0</div>
                <div style={{fontSize: 16, color: '#164a58', fontWeight: 600}}>KYC Checks</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop: 40, textAlign: 'center'}}>
          <button style={{padding: '16px 44px', borderRadius: 12, background: '#3EA76A', color: '#fff', fontWeight: 800, fontSize: 20, cursor: 'pointer', border: 'none', boxShadow: '0 2px 12px rgba(62,167,106,0.10)'}}>Copy API Key</button>
        </div>
      </div>
    </div>
  );
}
