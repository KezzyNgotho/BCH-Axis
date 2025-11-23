// KYC status endpoint: POST { token }
// Decodes token produced by kyc.js and returns whether approvalAt has passed.

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || await jsonFromReq(req);
    const { token } = body || {};
    if (!token) return res.status(400).json({ error: 'token required' });
    let payload;
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    } catch (e) {
      return res.status(400).json({ error: 'invalid token' });
    }
    const now = Date.now();
    const verified = !!(payload && payload.approvalAt && now >= payload.approvalAt);
    return res.status(200).json({ verified, approvalAt: payload.approvalAt, now });
  } catch (err) {
    console.error('kyc-status error', err);
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
