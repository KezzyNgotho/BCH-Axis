// Stateless demo endpoints to hash and verify API keys. Useful for showing how to store only hashed keys.

import crypto from 'crypto';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    const body = req.body || await jsonFromReq(req);
    const { action } = body || {};
    if (req.method === 'POST') {
      if (action === 'hash') {
        const { key } = body || {};
        if (!key) return res.status(400).json({ error: 'key required' });
        const salt = crypto.randomBytes(8).toString('hex');
        const hash = crypto.createHmac('sha256', salt).update(key).digest('hex');
        return res.status(200).json({ salt, hash, stored: salt + '$' + hash });
      }
      if (action === 'verify') {
        const { key, stored } = body || {};
        if (!key || !stored) return res.status(400).json({ error: 'key and stored required' });
        const [salt, hash] = stored.split('$');
        const check = crypto.createHmac('sha256', salt).update(key).digest('hex');
        return res.status(200).json({ ok: check === hash });
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('keys handler error', err);
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
