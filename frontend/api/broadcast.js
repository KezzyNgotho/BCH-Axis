// Broadcast proxy serverless function
// Accepts JSON { rawtx, blockbook } and forwards to Blockbook /api/v2/sendtx/

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || await jsonFromReq(req);
    const { rawtx, blockbook } = body || {};
    if (!rawtx || !blockbook) return res.status(400).json({ error: 'rawtx and blockbook required' });
    const bb = blockbook.replace(/\/$/, '');
    const url = `${bb}/api/v2/sendtx/`;
    const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rawtx }) });
    const text = await resp.text();
    if (!resp.ok) return res.status(502).json({ error: 'Blockbook broadcast failed', status: resp.status, body: text });
    return res.status(200).json({ txid: text.trim() });
  } catch (err) {
    console.error('broadcast error', err);
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
