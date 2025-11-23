import React, { useState } from "react";
let Wallet;
try {
  // Dynamically import Cashionize only if needed

} catch {}

export default function ConnectWallet({ onConnect, onClose }) {
  const [error, setError] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [inBrowserWallet, setInBrowserWallet] = useState(null);

  // Detect available wallets
  const detectedWallets = [];
  if (window.BCH) detectedWallets.push({ name: "Paytaca/Badger", api: window.BCH });
  // Add more wallet detection here if needed

  const connectSelectedWallet = async () => {
    if (!selectedWallet) return;
    try {
      const accounts = await selectedWallet.api.request({ method: "bch_requestAccounts" });
      const address = accounts[0];
      onConnect({ address, wallet: selectedWallet.name });
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const createInBrowserWallet = () => {
    if (!Wallet) {

      return;
    }
    const wallet = new Wallet();
    setInBrowserWallet(wallet);
    onConnect({ address: wallet.getAddress(), wif: wallet.getWIF(), wallet: 'Cashionize (in-browser)' });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Connect BCH Wallet</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {detectedWallets.length === 0 && !inBrowserWallet && (
          <>
            <p>No BCH wallet extension detected.</p>
            <button onClick={createInBrowserWallet} style={styles.button}>Create In-Browser Wallet</button>
            <div style={{ marginTop: 16, fontSize: 14 }}>
              <p>
                Don’t have a wallet? <a href="https://paytaca.com/" target="_blank" rel="noopener noreferrer">Install Paytaca</a> or <a href="https://badgerwallet.io/" target="_blank" rel="noopener noreferrer">Badger Wallet</a>.
              </p>
            </div>
          </>
        )}
        {detectedWallets.length === 1 && !inBrowserWallet && (
          <>
            <p>Detected wallet: <strong>{detectedWallets[0].name}</strong></p>
            <button onClick={() => { setSelectedWallet(detectedWallets[0]); connectSelectedWallet(); }} style={styles.button}>Connect</button>
          </>
        )}
        {detectedWallets.length > 1 && !inBrowserWallet && (
          <>
            <p>Select a wallet to connect:</p>
            {detectedWallets.map((wallet, idx) => (
              <button
                key={wallet.name}
                onClick={() => { setSelectedWallet(wallet); connectSelectedWallet(); }}
                style={{ ...styles.button, marginBottom: 8 }}
              >
                {wallet.name}
              </button>
            ))}
          </>
        )}
        {inBrowserWallet && (
          <div style={{ marginTop: 16 }}>
            <div><strong>Address:</strong> {inBrowserWallet.getAddress()}</div>
            <div><strong>Private Key (WIF):</strong> <span style={{ wordBreak: 'break-all' }}>{inBrowserWallet.getWIF()}</span></div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#b00' }}>
              <strong>Warning:</strong> Save your private key securely. Anyone with this key can spend your BCH.
            </div>
          </div>
        )}
        <button onClick={onClose} style={{ ...styles.button, marginTop: 12, background: "#ccc" }}>Close</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: 32,
    borderRadius: 12,
    textAlign: "center",
    width: 320,
  },
  button: {
    padding: "12px 24px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#1D546C",
    color: "#fff",
    cursor: "pointer",
  },
};
