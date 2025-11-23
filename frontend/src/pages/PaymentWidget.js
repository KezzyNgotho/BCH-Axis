import React from "react";
import QRCode from "qrcode.react";
// import { useWatchAddress } from "../components/ConnectWallet";

export default function PaymentWidget({ merchantAddress, tokenId }) {
  const { balance, tokenBalance, utxos, tokenUtxos } = useWatchAddress(merchantAddress, tokenId);

  return (
    <div style={{ padding: 24, border: "1px solid #eee", borderRadius: 12, maxWidth: 400, margin: "40px auto", background: "#fff" }}>
      <h2 style={{ marginBottom: 16 }}>Pay this Merchant</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>BCH Address:</strong>
        <div style={{ margin: "8px 0" }}>
          <QRCode value={merchantAddress} size={128} />
        </div>
        <div style={{ fontSize: 14, wordBreak: "break-all" }}>{merchantAddress}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>BCH Balance:</strong> {balance !== undefined ? (balance / 1e8).toFixed(8) : "..."} BCH
      </div>
      {tokenId && (
        <div style={{ marginBottom: 16 }}>
          <strong>Layla Chips Balance:</strong> {tokenBalance !== undefined ? tokenBalance.toString() : "..."}
        </div>
      )}
      <div style={{ marginTop: 24, fontSize: 13, color: "#888" }}>
        Scan the QR code or copy the address to pay with BCH or Layla Chips (CashTokens).
      </div>
    </div>
  );
}
