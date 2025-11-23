import React from "react";

export default function MerchantDashboard({ merchant }) {
  if (!merchant) {
    return (
      <div style={{padding: '48px', textAlign: 'center', color: '#888'}}>
        <h2>Merchant Dashboard</h2>
        <p>No merchant data available. Please complete onboarding.</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '900px', margin: '48px auto', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', padding: '2.5rem', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <h2 style={{fontSize: 32, fontWeight: 800, color: '#1D546C', marginBottom: 12}}>Merchant Portal</h2>
      <div style={{marginBottom: 32, color: '#3EA76A', fontWeight: 600}}>
        <span>Status: </span>
        {merchant.kycApproved ? (
          <span style={{color: '#3EA76A'}}>KYC Approved</span>
        ) : (
          <span style={{color: '#d32f2f'}}>KYC Pending</span>
        )}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: 32}}>
        <div>
          <h4 style={{fontWeight: 700, color: '#164a58'}}>Merchant Name</h4>
          <p style={{fontSize: 18}}>{merchant.name}</p>
        </div>
        <div>
          <h4 style={{fontWeight: 700, color: '#164a58'}}>Business Name</h4>
          <p style={{fontSize: 18}}>{merchant.businessName}</p>
        </div>
        <div>
          <h4 style={{fontWeight: 700, color: '#164a58'}}>Email</h4>
          <p style={{fontSize: 18}}>{merchant.email}</p>
        </div>
        <div>
          <h4 style={{fontWeight: 700, color: '#164a58'}}>Wallet (XPUB)</h4>
          <p style={{fontSize: 18, wordBreak: 'break-all'}}>{merchant.xpub}</p>
        </div>
      </div>
      <div style={{marginBottom: 32}}>
        <h4 style={{fontWeight: 700, color: '#164a58'}}>API Key</h4>
        <div style={{background: '#EAF6F8', borderRadius: 10, padding: '18px', fontSize: 18, fontWeight: 700, color: '#3EA76A', wordBreak: 'break-all'}}>
          {merchant.apiKey}
        </div>
      </div>
      <div style={{marginTop: 32, textAlign: 'center'}}>
        <button style={{padding: '14px 36px', borderRadius: 10, background: '#3EA76A', color: '#fff', fontWeight: 700, fontSize: 18, cursor: 'pointer', border: 'none', boxShadow: '0 2px 8px rgba(62,167,106,0.10)'}}>Copy API Key</button>
      </div>
    </div>
  );
}
