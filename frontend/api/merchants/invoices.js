// Serverless invoices handler (frontend/api/merchants/invoices.js)
// This is a lightweight stub to demonstrate the serverless API surface for merchants invoices.
// In a production deployment, replace the in-memory/placeholder logic with calls to your ledger or on-chain derivation service.

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'POST') {
      const body = req.body || await jsonFromReq(req);
      const { merchantId, amount } = body || {};
      if (!merchantId || !amount) return res.status(400).json({ error: 'merchantId and amount required' });
      // TODO: Derive a payment address using merchant.xpub + next_index
      const invoiceId = `inv-${Date.now()}`;
      const address = 'bitcoincash:placeholder-address';
      return res.status(201).json({ id: invoiceId, merchantId, amount, address, status: 'pending' });
    }
    if (req.method === 'GET') {
      // For demo: return an empty list or echo query
      return res.status(200).json({ invoices: [] });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('invoices handler error', err);
    return res.status(500).json({ error: String(err) });
  }
}

async function jsonFromReq(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}
