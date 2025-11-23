import "dotenv/config";
import fs from "fs";
import path from "path";
import { Contract, ElectrumNetworkProvider } from "cashscript";
import { Wallet } from "mainnet-js";

const CHIPNET_WIF = process.env.CHIPNET_WIF;
if (!CHIPNET_WIF) {
  console.error("❌ Missing CHIPNET_WIF in .env");
  process.exit(1);
}

// Chipnet Electrum provider
const provider = new ElectrumNetworkProvider("chipnet");

// Load compiled CashScript artifact
const artifactPath = path.join("./build", "MerchantRegistry.json");
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

// Constructor arguments
const OWNER_PUBKEY = Uint8Array.from([
  4, 57, 36, 158, 8, 77, 236, 161, 164, 140, 148,
  253, 101, 91, 228, 188, 159, 84, 43, 217, 54, 27,
  126, 202, 63, 213, 249, 16, 138, 89, 249, 59, 139,
  136, 169, 218, 85, 195, 109, 244, 19, 17, 176, 233,
  90, 53, 152, 9, 173, 182, 239, 16, 216, 85, 41,
  159, 109, 162, 77, 89, 117, 137, 150, 94, 80
]);
const MERCHANT_CATEGORY = Buffer.from("retail");

async function main() {
  try {
    // 1️⃣ Instantiate contract (no deployment needed)
    const contract = new Contract(
      artifact,
      [OWNER_PUBKEY, MERCHANT_CATEGORY],
      { provider }
    );

    console.log("Contract address:", contract.address);

    // 2️⃣ Load wallet (fallback for different mainnet-js versions)
    let wallet;
    if (Wallet.fromWIF) {
      wallet = await Wallet.fromWIF(CHIPNET_WIF);
    } else if (Wallet.fromWif) {
      wallet = await Wallet.fromWif(CHIPNET_WIF);
    } else {
      wallet = new Wallet(CHIPNET_WIF);
    }
    console.log("✅ Wallet loaded");

    // 3️⃣ Fund contract UTXO
    const tx = await wallet.send([
      { cashaddr: contract.address, value: 5000, unit: "sats" }
    ]);

    console.log("✅ Contract funded successfully!");
    console.log("Funding TXID:", tx.txid);

  } catch (err) {
    console.error("❌ Deployment failed:", err);
  }
}

main();
