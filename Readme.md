# BCH Axis - Merchant Dashboard & Layla CHIPs Integration

A full-featured **Bitcoin Cash (BCH) merchant dashboard** powered by **Layla CHIPs** smart contracts.  
Merchants can manage payments, invoices, KYC verification, payouts, and interact with deployed smart contracts via a clean React dashboard.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Payments Engine](#payments-engine)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [Contracts](#contracts)
7. [Roadmap](#roadmap)
8. [Future Enhancements](#future-enhancements)
9. [License](#license)

---

## Project Overview
This project provides a complete **merchant platform on Bitcoin Cash**, using:

- BCH Layer 1 via **Layla CHIPs**
- React frontend for merchant dashboard
- Local and remote nodes for chipnet/testnet
- API for transactions, payouts, and contract interaction

Merchants can:

- Track revenue, invoices, and payouts
- Manage API keys
- Monitor KYC status
- Interact with smart contracts deployed on BCH

---

## Architecture

Merchant Dashboard & UI)    │
└─────────────┬─────────────────┘
│ API Calls
▼
┌───────────────────────────────┐
│       Payments Engine          │
│ - Invoice generation           │
│ - Payment processing           │
│ - Payout handling              │
│ - Transaction ledger           │
└─────────────┬─────────────────┘
│ RPC / SDK
▼
┌───────────────────────────────┐
│ BCH Node (Layla CHIPs)        │
│ - Confirms transactions       │
│ - Executes smart contracts    │
└─────────────┬─────────────────┘
│
▼
┌───────────────────────────────┐
│       Smart Contracts          │
│ - Payment / Payout Logic      │
│ - Merchant-specific contracts │
└───────────────────────────────┘

---

## Payments Engine

The **Payments Engine** is the core backend system that manages all financial operations for merchants:

### Responsibilities
1. **Receive Payments**
   - Accept BCH payments via smart contracts or directly.
   - Verify confirmations on the blockchain.
   - Update merchant balances.

2. **Invoices**
   - Generate unique invoices with expiration times.
   - Track invoice status: pending, confirmed, failed.
   - Support partial payments or multiple attempts.

3. **Payouts**
   - Process merchant payout requests.
   - Track payout history and status.
   - Ensure KYC compliance before payouts.

4. **KYC / Compliance**
   - Check merchant verification before enabling withdrawals.
   - Prevent unauthorized payouts.

5. **Notifications / Alerts**
   - Notify merchants of new payments, failed transactions, or completed payouts.
   - Optional webhooks for external integrations.

6. **Transaction Ledger**
   - Immutable logs of all transactions.
   - Includes date, amount, sender, receiver, status, and TXID.

### Example Models

**Invoice Model**

```js
const invoice = {
  id: "INV-12345",
  merchantId: "M-98765",
  amount: 0.5,        // in BCH
  status: "pending",  // pending / confirmed / failed
  createdAt: Date.now(),
  expiresAt: Date.now() + 3600 * 1000 // 1 hour
};

Payout Model
const payout = {
  id: "PO-98765",
  merchantId: "M-98765",
  amount: 2.0,        // BCH
  status: "requested", // requested / processing / completed
  destinationAddress: "bitcoincash:qp...xyz",
  createdAt: Date.now(),
  completedAt: null
};

Transaction Verification (pseudo-code)
async function checkPayment(txid) {
  const tx = await layla.getTransaction(txid);
  if (tx.confirmations >= 2) {
    markInvoiceAsConfirmed(txid);
  }
}

Optional Features


Multi-merchant support (sub-accounts / wallet per merchant)


Escrow / conditional payments via smart contracts


Third-party API integrations (/api/invoice/create, /api/payout/request)


Real-time notifications to dashboard (Socket.IO / WebSockets)



Features


Merchant Profile Management


API Key Generation & Copy


Real-time KPIs: Total Transactions, Revenue, Active Invoices


Contract Interaction (deploy, call functions)


KYC Verification Status


Payments / Payouts Section


Analytics Charts (Revenue / Transactions)


Notifications for transactions & payouts



Installation & Setup


Clone the repository


git clone https://github.com/KezzyNgotho/bch-axis.git
cd bch-axis



Install dependencies


npm install



Set up BCH Layla Node


layla-node start --network chipnet



Store merchant info locally for testing


localStorage.setItem("merchant", JSON.stringify({
  name: "John Doe",
  businessName: "Doe Merchants",
  email: "merchant@example.com",
  xpub: "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKpY2x...",
  apiKey: "abc123xyz",
  kycApproved: true
}));



Run Frontend


npm start



Compile & Deploy Contracts


layla compile contracts/MyContract.js
layla deploy contracts/MyContract.js --network chipnet


Contracts
Contract NameDescriptionNetworkDeployed Address / TXIDMerchantPaymentHandles merchant paymentsChipnetTBDMerchantEscrowEscrow for payoutsChipnetTBDKYCVerifierTracks KYC approval statusChipnetTBD

Replace TBD with your actual deployed contract addresses after deployment.


Roadmap
Phase 1: MVP


 React merchant dashboard


 Profile & API key management


 KPI cards & stats


 Local Layla CHIPs node setup


Phase 2: Smart Contracts Integration


 Deploy merchant payment contracts


 Deploy escrow / payout contracts


 Connect dashboard to contracts


Phase 3: Advanced Features


 Analytics charts (daily/weekly/monthly revenue)


 Transaction tables & export


 Notifications / Alerts


 Multi-merchant support


 Payout automation


Phase 4: Production Release


 Full mainnet deployment


 User authentication & multi-wallet support


 UI polish & mobile responsiveness



Future Enhancements


Real-time BCH payment tracking


Multiple contract types (subscription, refunds)


Integration with third-party merchant tools


Webhooks for automated notifications



License
MIT License © 2025 Kezz Ngotho
