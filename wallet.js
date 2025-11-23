import bch from "bitcore-lib-cash";
import { Wallet } from "mainnet-js";

function generateWallet() {
  // Create a random private key
  const privateKey = new bch.PrivateKey(); // now works
  const wif = privateKey.toWIF();

  // Instantiate Mainnet-JS wallet for Chipnet
  const wallet = new Wallet(wif, { network: "chipnet" });

  console.log("🔑 WIF (private key):", wif);
  console.log("🏦 CHIPNET Address:", wallet.cashaddr);
  console.log("📝 Public key:", wallet.publicKey);
}

generateWallet();
