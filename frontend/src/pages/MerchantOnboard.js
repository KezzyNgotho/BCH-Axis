import { useState } from "react";
import React from "react";
import { onboardMerchant } from "../lib/onchain";
import {
  FaUser,
  FaKey,
  FaEnvelope,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

export default function MerchantOverlay({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [xpub, setXpub] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [txid, setTxid] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kycApproved, setKycApproved] = useState(false);

  const steps = [
    { icon: FaUser, label: "Identity" },
    { icon: FaEnvelope, label: "Contact" },
    { icon: FaCheckCircle, label: "KYC" },
    { icon: FaCheckCircle, label: "Done" }
  ];

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Wallet connection
  const connectWallet = async (wallet) => {
    try {
      let address;
      if (wallet === "Badger" && window.badger) {
        const resp = await window.badger.request({ method: "getAddress" });
        address = resp.address;
      } else if (wallet === "Paytaca" && window.paytaca) {
        const resp = await window.paytaca.request({ method: "getAddress" });
        address = resp.address;
      } else {
        throw new Error("Wallet not detected or not supported.");
      }
      setWalletAddress(address);
      localStorage.setItem("bch_wallet", JSON.stringify({ address }));
      console.log("Connected wallet:", address);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (!walletAddress) throw new Error("Please connect your BCH wallet.");

      // Prepare merchant data as hex string
      const merchantDataObj = {
        name,
        businessEmail,
        website,
        phone,
        address,
        city,
        state,
        country,
        zip,
        xpub,
        ts: Date.now()
      };
      const merchantDataHex = Array.from(
        new TextEncoder().encode(JSON.stringify(merchantDataObj))
      ).map(b => b.toString(16).padStart(2, "0")).join("");

      // Simple SHA256 hash using Web Crypto API
      const buffer = new Uint8Array(merchantDataHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      // Demo signature placeholder
      const ownerSig = "demo-signature";

      // Pass correct arguments: (ownerSig, merchantWallet, merchantDataHex)
      const result = await onboardMerchant(ownerSig, walletAddress, merchantDataHex);
      setTxid(result?.txid || JSON.stringify(result));
      setStep(4); // Success
    } catch (err) {
      setError(err?.message || "Failed to onboard merchant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff", borderRadius:"1.5rem", boxShadow:"0 8px 40px rgba(0,0,0,0.18)", maxWidth:"900px", width:"100%", minWidth:"600px", padding:"2.5rem", position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute", top:18, right:18, fontSize:22, color:"#888", background:"none", border:"none", cursor:"pointer"}}>&#10005;</button>
        <h2 style={{fontSize:26, fontWeight:800, color:"#1D546C", marginBottom:4}}>Merchant Onboarding</h2>
        <p style={{color:"#3EA76A", fontWeight:600, marginBottom:18}}>Complete all steps to onboard and generate your API key.</p>

        {/* Wallet Connect */}
        {!walletAddress && (
          <div style={{marginBottom:24}}>
            <p style={{marginBottom:8}}>Connect your BCH wallet:</p>
            <label htmlFor="walletAddress">Enter your BCH wallet address:</label>
            <input
              id="walletAddress"
              type="text"
              style={{ width: '100%', padding: 8, marginTop: 8, fontSize: 16 }}
              value={walletAddress}
              onChange={e => setWalletAddress(e.target.value)}
              placeholder="bitcoincash:... or chipnet:..."
            />
            {error && <p style={{color:"red"}}>{error}</p>}
          </div>
        )}

        {/* Stepper */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:18, marginBottom:28}}>
          {steps.map((s, i) => (
            <div key={i} style={{display:"flex", flexDirection:"column", alignItems:"center", opacity: step === i+1 || step > i+1 ? 1 : 0.4}}>
              <div style={{background: step === i+1 ? '#3EA76A' : '#EAF6F8', color: step === i+1 ? '#fff' : '#1D546C', borderRadius:12, width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:4}}>
                {s.icon && React.createElement(s.icon)}
              </div>
              <div style={{fontSize:13, fontWeight:600}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Steps Content */}
        {step === 1 && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
            <div><input placeholder="Merchant Name *" value={name} onChange={e => setName(e.target.value)} /></div>
            <div><input placeholder="XPUB *" value={xpub} onChange={e => setXpub(e.target.value)} /></div>
          </div>
        )}
        {step === 2 && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px'}}>
            <input placeholder="Business Email *" value={businessEmail} onChange={e => setBusinessEmail(e.target.value)} />
            <input placeholder="Website (optional)" value={website} onChange={e => setWebsite(e.target.value)} />
            <input placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} />
            <input placeholder="Street Address *" value={address} onChange={e => setAddress(e.target.value)} />
            <input placeholder="City *" value={city} onChange={e => setCity(e.target.value)} />
            <input placeholder="State/Province *" value={state} onChange={e => setState(e.target.value)} />
            <input placeholder="Country *" value={country} onChange={e => setCountry(e.target.value)} />
            <input placeholder="ZIP / Postal Code *" value={zip} onChange={e => setZip(e.target.value)} />
          </div>
        )}
        {step === 3 && walletAddress && (
          <div>
            <label>
              <input type="checkbox" checked={kycApproved} onChange={e => setKycApproved(e.target.checked)} />
              I confirm this merchant has passed KYC verification
            </label>
            <button onClick={handleSubmit} disabled={!kycApproved || loading} style={{marginTop:12}}>
              {loading ? "Processing..." : "Submit & Generate API Key"}
            </button>
          </div>
        )}
        {step === 4 && txid && (
          <div style={{marginTop:24}}>
            <p>Success! TXID: {txid}</p>
          </div>
        )}

        <div style={{display:'flex', justifyContent:'space-between', marginTop:32}}>
          {step > 1 && <button onClick={handleBack}>Back</button>}
          {step < 3 && <button onClick={handleNext} disabled={(step===1 && (!name||!xpub)) || (step===2 && (!businessEmail||!phone||!address||!city||!state||!country||!zip))}>Next</button>}
        </div>
      </div>
    </div>
  );
}
