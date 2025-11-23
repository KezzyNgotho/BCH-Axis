This folder contains serverless-style functions useful as a lightweight serverless backend for `bch-axis`.

Purpose
- Provide simple serverless endpoints to support onboarding flows from the frontend while keeping server logic minimal.
- Can be deployed to Netlify Functions, Vercel Serverless Functions, or similar platforms that map `api/*` to function handlers.

Provided endpoints
- `prepare-registration.js` — Prepare an on-chain merchant registration payload (returns JSON payload and OP_RETURN hex).
- `claim-registration.js` — Given a TXID and a Blockbook URL, fetches the tx and verifies an OP_RETURN with `type: 'merchant-reg'` and returns parsed payload.
- `broadcast.js` — Proxy to Blockbook `/api/v2/sendtx/` to help with CORS when broadcasting raw tx hex from the browser (optional).
 - `broadcast.js` — Proxy to Blockbook `/api/v2/sendtx/` to help with CORS when broadcasting raw tx hex from the browser (optional).
 - `merchants/` — Folder with merchant-related serverless endpoints:
	 - `merchants/invoices.js` — invoice creation/listing stub
	 - `merchants/kyc.js` — KYC submission stub
	 - `merchants/webhook.js` — webhook registration stub
	 - `merchants/auth.js` — challenge/verify auth stubs (challenge issuance and verify stub)

Notes
- These handlers use the global `fetch` API. Vercel and Netlify support `fetch` in Node 18+ runtimes. If your platform requires `node-fetch`, add it as a dependency.
- Keep secrets out of these functions. If you add API keys, use the platform's secret storage (Netlify env, Vercel env).

Deployment
- Netlify: functions go under `frontend/api` or `netlify/functions` depending on your build setup. See Netlify docs.
- Vercel: create `api/*.js` files at the project root or adjust accordingly.

Example usage (client-side):
- POST `/api/prepare-registration` with `{ name, xpub }` to get `payload`, `payloadStr`, `opReturnHex`.
- POST `/api/claim-registration` with `{ txid, blockbook }` to verify and return the parsed OP_RETURN JSON.
- POST `/api/broadcast` with `{ rawtx, blockbook }` to broadcast a raw transaction via Blockbook (proxy).

Security
- These endpoints do not store state and are stateless. They simply help with CORS and convenience.
- Ensure you enable HTTPS on your deployment.
