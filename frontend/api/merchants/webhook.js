// Serverless webhook registration handler (frontend/api/merchants/webhook.js)
// This is a stateless stub that echoes webhook registration requests. For production, persist webhooks.

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || await jsonFromReq(req);
    const { merchantId, url } = body || {};
    if (!merchantId || !url) return res.status(400).json({ error: 'merchantId and url required' });
    // TODO: Persist webhook registration in a DB or durable store
    return res.status(200).json({ merchantId, url, status: 'registered', registeredAt: Date.now() });
  } catch (err) {
    console.error('webhook handler error', err);
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
