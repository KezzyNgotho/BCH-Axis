// Prepare-registration serverless function
// Accepts JSON { name, xpub } and returns payload, payloadStr, opReturnHex

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || await jsonFromReq(req);
    const { name, xpub } = body || {};
    if (!name || !xpub) return res.status(400).json({ error: 'name and xpub required' });
    const payload = { type: 'merchant-reg', name, xpub, ts: Date.now() };
    const payloadStr = JSON.stringify(payload);
    const opReturnHex = Buffer.from(payloadStr, 'utf8').toString('hex');
    return res.status(200).json({ payload, payloadStr, opReturnHex });
  } catch (err) {
    console.error('prepare-registration error', err);
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
