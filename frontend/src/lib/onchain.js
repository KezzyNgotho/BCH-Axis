// src/lib/onchain.js
import { Contract, FullStackNetworkProvider, utils } from "cashscript";
import MerchantRegistryArtifact from "../build/MerchantRegistry.json";

// Initialize network provider (use testnet or local regtest)
const provider = new FullStackNetworkProvider({
  network: "chipnet" // use chipnet for CashTokens/BCH dev
});

// Function to create contract instance
export function getMerchantRegistryContract(pubkey) {
  try {
    // Pass constructor args as an array, even if only one
    return new Contract(MerchantRegistryArtifact, [pubkey], { provider });
  } catch (err) {
    console.error("Error initializing contract:", err);
    throw err;
  }
}

// Onboard merchant: store data on-chain
export async function onboardMerchant(ownerSig, merchantWallet, merchantDataHex) {
  try {
    // Use a fixed owner pubkey (replace with your real pubkey for production)

    // IMPORTANT: Replace with a real compressed public key (66 hex chars, starts with 02 or 03)
    const OWNER_PUBKEY = "02c123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    if (!/^0[23][0-9a-fA-F]{64}$/.test(OWNER_PUBKEY)) {
      throw new Error("OWNER_PUBKEY is not a valid compressed public key. Please set a real 66-char hex pubkey starting with 02 or 03.");
    }
    const contract = getMerchantRegistryContract(OWNER_PUBKEY);

    // Debug: log available contract methods
    if (!contract.methods || !contract.methods.registerMerchant) {
      console.error("registerMerchant is not defined on contract.methods", { methods: contract.methods, abi: MerchantRegistryArtifact.abi });
      throw new Error("registerMerchant is not defined on contract.methods. Check ABI and contract compilation.");
    }

    // 2. Call registerMerchant(ownerSig, merchantWallet, merchantData)
    const tx = await contract.methods.registerMerchant(ownerSig, merchantWallet, merchantDataHex).send();

    console.log("Merchant onboarded, TXID:", tx.txid);

    return { txid: tx.txid };
  } catch (err) {
    console.error("Error onboarding merchant:", err);
    throw err;
  }
}
