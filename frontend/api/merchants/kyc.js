// Serverless KYC handler (frontend/api/merchants/kyc.js)
// Simple stub that accepts KYC submissions. This does not persist data across invocations.

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || await jsonFromReq(req);
    const { merchantId, kycData } = body || {};
    if (!merchantId || !kycData) return res.status(400).json({ error: 'merchantId and kycData required' });
    // For demo: simulate an asynchronous KYC process that auto-approves after 2 minutes.
    const now = Date.now();
    const approvalAt = now + 2 * 60 * 1000; // 2 minutes
    const tokenPayload = { merchantId, approvalAt };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    // Return pending status with an approval timestamp and a token the frontend can poll with.
    return res.status(200).json({ merchantId, status: 'pending', approvalAt, token, receivedAt: now });
  } catch (err) {
    console.error('kyc handler error', err);
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
