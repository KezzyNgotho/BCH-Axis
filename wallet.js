const BCHJS = require('@psf/bch-js');
const bchjs = new BCHJS({ restURL: 'https://tapi.fullstack.cash/v5/' });

async function main() {
  // Generate a new 12-word mnemonic
  const mnemonic = bchjs.Mnemonic.generate(128); // 128-bit entropy = 12 words
  console.log('Your testnet mnemonic (SAVE THIS):', mnemonic);

  // Derive root seed from mnemonic (await because it returns a Promise)
  const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);

  // Derive HDNode for testnet
  const masterHDNode = bchjs.HDNode.fromSeed(rootSeed, 'testnet');

  // Derive first keypair
  const keyPair = bchjs.HDNode.toKeyPair(masterHDNode);
  const cashAddress = bchjs.HDNode.toCashAddress(masterHDNode);
  const legacyAddress = bchjs.HDNode.toLegacyAddress(masterHDNode);
  const publicKey = bchjs.HDNode.toPublicKey(masterHDNode);

  console.log('Cash Address (testnet):', cashAddress);
  console.log('Legacy Address (testnet):', legacyAddress);
  console.log('Public Key:', publicKey);
}

// Run the async main function
main().catch(console.error);
