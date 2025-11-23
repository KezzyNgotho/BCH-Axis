// Claim-registration serverless function
// Accepts JSON { txid, blockbook } and returns parsed OP_RETURN payload if it contains type:'merchant-reg'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body || await jsonFromReq(req);
    const { txid, blockbook } = body || {};
    if (!txid || !blockbook) return res.status(400).json({ error: 'txid and blockbook required' });
    const bb = blockbook.replace(/\/$/, '');
    const url = `${bb}/api/v2/tx/${txid}`;
    const resp = await fetch(url);
    if (!resp.ok) return res.status(502).json({ error: 'Blockbook fetch failed', status: resp.status });
    const tx = await resp.json();
    const vouts = tx.vout || [];
    for (const v of vouts) {
      try {
        const hex = (v.scriptPubKey && v.scriptPubKey.hex) || v.hex || v.script || null;
        if (!hex) continue;
        let payloadHex = hex;
        if (payloadHex.startsWith('6a')) {
          const rest = payloadHex.slice(2);
          const lenByte = rest.slice(0, 2);
          const len = parseInt(lenByte, 16);
          if (!Number.isNaN(len) && rest.length >= 2 + len * 2) {
            payloadHex = rest.slice(2, 2 + len * 2);
          } else {
            payloadHex = rest;
          }
        }
        const text = Buffer.from(payloadHex, 'hex').toString('utf8');
        const obj = JSON.parse(text);
        if (obj && obj.type === 'merchant-reg') return res.status(200).json({ payload: obj });
      } catch (e) {
        // ignore and continue
      }
    }
    return res.status(404).json({ error: 'No merchant-reg OP_RETURN found in tx outputs' });
  } catch (err) {
    console.error('claim-registration error', err);
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
