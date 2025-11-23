// Serverless auth helper - merchant challenge/verify (frontend/api/merchants/auth.js)
// This file provides simple, stateless endpoints for challenge issuance and a verification stub.
// In production you'll want to implement proper signature verification against derived addresses and
// persist nonces in a durable store or use stateless signed nonces (e.g., signed JWTs).

import crypto from 'crypto';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'POST') {
      const body = req.body || await jsonFromReq(req);
      const { action } = body || {};
      if (action === 'challenge') {
        const { merchantId } = body || {};
        if (!merchantId) return res.status(400).json({ error: 'merchantId required' });
        // generate a short-lived nonce
        const nonce = crypto.randomBytes(16).toString('hex');
        // Note: serverless functions are ephemeral. For real verification, keep the nonce in a database
        // or use a signed token containing the nonce and expiry.
        return res.status(200).json({ nonce, message: `Please sign this challenge: ${nonce}` });
      }
      if (action === 'verify') {
        const { merchantId, message, signature } = body || {};
        if (!merchantId || !message || !signature) return res.status(400).json({ error: 'merchantId, message, and signature required' });
        // TODO: Implement on-chain address recovery and verify signature matches an address derived from merchant xpub.
        // For now, return a placeholder success to let clients proceed in dev.
        return res.status(200).json({ verified: true, note: 'Stub: implement actual signature verification in production' });
      }
      return res.status(400).json({ error: 'Unknown action. Use action=challenge or action=verify' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('auth handler error', err);
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
