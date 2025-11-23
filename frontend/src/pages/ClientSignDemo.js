import React, { useState } from 'react';

// This React demo shows how to call the backend prepare endpoint and
// how you would wire up CashScript in the browser to build & sign a
// contract spend. It prints guidance and example code because exact
// CashScript browser APIs and bundling depend on your setup.

export default function ClientSignDemo() {
  const [vaultId, setVaultId] = useState('Vault');
  const [recipient, setRecipient] = useState('bchtest:qr...');
  const [amount, setAmount] = useState(10000);
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('idle');

  async function onPrepare(e) {
    e.preventDefault();
    setStatus('preparing');
    try {
      const res = await fetch(`/api/vault/${encodeURIComponent(vaultId)}/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount })
      });
      const j = await res.json();
      setPayload(j);
      setStatus('prepared');
    } catch (err) {
      setStatus('error: ' + (err.message || err));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Client-side CashScript Sign Demo</h2>
      <form onSubmit={onPrepare}>
        <div>
          <label>Vault Id / Name: </label>
          <input value={vaultId} onChange={e => setVaultId(e.target.value)} />
        </div>
        <div>
          <label>Recipient (bchtest:...): </label>
          <input value={recipient} onChange={e => setRecipient(e.target.value)} />
        </div>
        <div>
          <label>Amount (sats): </label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        </div>
        <button type="submit">Prepare</button>
      </form>

      <div style={{ marginTop: 20 }}>
        <strong>Status:</strong> {status}
      </div>

      {payload && (
        <div style={{ marginTop: 20 }}>
          <h3>Prepare Payload</h3>
          <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>{JSON.stringify(payload, null, 2)}</pre>

          <h4>Browser Signing Guidance</h4>
          <p>
            Recommended approach: bundle `cashscript` into your frontend (same minor version used
            to compile contracts). Then instantiate a Contract and use its function call API to
            construct the spending transaction. Use a secure client-side wallet to sign and then
            POST the final raw tx hex to <code>/api/tx/broadcast</code>.
          </p>

          <h5>Example (pseudocode):</h5>
          <pre style={{ background: '#fff8e1', padding: 10 }}>
{`import { ElectrumNetworkProvider, Contract } from 'cashscript';

const provider = new ElectrumNetworkProvider(process.env.REACT_APP_ELECTRUM_URL);
const contract = new Contract(PAYLOAD.artifact, PAYLOAD.vault.address, provider);

// Create a call builder for the 'spend' function (signature depends on ABI)
const call = contract.functions.spend(PAYLOAD.amountSats);

// Use the library API to create a transaction (some versions return a tx object or hex)
// Example: const tx = await call.createTransaction({ utxos: PAYLOAD.utxos, to: PAYLOAD.to, changeAddress: PAYLOAD.vault.address });

// Sign the transaction using a client-side wallet extension (e.g. Paytaca, Badger)
// Then POST raw hex to /api/tx/broadcast
fetch('/api/tx/broadcast', { method: 'POST', body: JSON.stringify({ rawTxHex: SIGNED_HEX }), headers: { 'Content-Type':'application/json' } });`}
          </pre>

          <p style={{ color: '#a00' }}>
            Note: exact function names vary across CashScript releases. If the library's browser API
            exports different helpers (e.g. <code>toTransaction</code>, <code>createTransaction</code> or <code>send</code>), adapt accordingly.
          </p>
        </div>
      )}
    </div>
  );
}
