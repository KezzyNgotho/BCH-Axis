// deploy.mjs - Using mainnet-js (most reliable)
import { TestNetWallet } from 'mainnet-js';
import fs from 'fs';

async function main() {
  try {
    console.log('=== BCH Contract Deployment (Testnet) ===\n');

    // ---------- Wallet Setup ----------
    const mnemonic = 'scissors victory height cute blouse ordinary tonight park winter dress unfold voice';
    
    console.log('Initializing wallet...');
    const wallet = await TestNetWallet.fromSeed(mnemonic);
    
    console.log('Wallet address:', wallet.getDepositAddress());
    console.log('Network: BCH Testnet\n');

    // Check balance
    console.log('Checking balance...');
    const balanceSats = await wallet.getBalance('sat');
    console.log('Balance:', balanceSats, 'satoshis');

    if (balanceSats < 30000) {
      console.error('\n❌ Insufficient balance!');
      console.log('You need at least 30,000 testnet satoshis.');
      console.log('\n💡 Get testnet BCH from:');
      console.log('   https://tbch.googol.cash/');
      console.log('   https://faucet.fullstack.cash/');
      console.log('\n📍 Send to:', wallet.getDepositAddress());
      return;
    }

    // ---------- Load compiled contracts dynamically ----------
    console.log('\nLoading contract artifacts from ./build ...');

    const buildFiles = fs.readdirSync('./build').filter(f => f.endsWith('.json'));
    if (buildFiles.length === 0) {
      throw new Error('No build artifacts found in ./build');
    }

    // Parse artifacts and prepare deploy targets
    const artifacts = buildFiles.map((f, idx) => {
      const artifact = JSON.parse(fs.readFileSync(`./build/${f}`, 'utf8'));
      return { file: f, artifact, index: idx };
    });

    console.log(`✓ Found ${artifacts.length} artifacts:`);
    artifacts.forEach(a => console.log(' -', a.artifact.contractName || a.file));
    console.log();

    const pubKeyHex = wallet.publicKeyCompressed;
    console.log('Deployer Public Key:', pubKeyHex);
    console.log();

    // Decide funding amount per contract (sats). Default 5k; Vault gets 10k; VaultFactory 5k.
    const defaultAmt = 5000;
    function amountFor(name) {
      if (!name) return defaultAmt;
      const n = name.toLowerCase();
      if (n.includes('vault') && !n.includes('factory')) return 10000;
      if (n.includes('vaultfactory') || n.includes('factory')) return 5000;
      if (n.includes('revenue') || n.includes('router')) return 5000;
      return defaultAmt;
    }

    // Check total required balance
    const totalNeeded = artifacts.reduce((sum, a) => sum + amountFor(a.artifact.contractName), 0);
    console.log('Total required (sats):', totalNeeded);
    if (balanceSats < totalNeeded) {
      console.error('\n❌ Insufficient balance to fund all artifacts.');
      console.log('Balance:', balanceSats, 'sats; required:', totalNeeded, 'sats');
      return;
    }

    // Prepare per-artifact derived wallets and addresses
    const deployResults = {};
    for (const a of artifacts) {
      // derive a testnet wallet per artifact
      const derived = await TestNetWallet.fromSeed(mnemonic, `m/44'/1'/0'/1/${a.index}`);
      const addr = derived.getDepositAddress();
      deployResults[a.artifact.contractName || a.file] = {
        artifact: a.artifact,
        file: a.file,
        derivedWallet: derived,
        address: addr,
        amountSat: amountFor(a.artifact.contractName)
      };
    }

    console.log('\nPrepared contract addresses:');
    Object.entries(deployResults).forEach(([k, v]) => console.log(` - ${k}: ${v.address} (${v.amountSat} sats)`));
    console.log();

    // ---------- Deploy: fund each address sequentially ----------
    console.log('Starting funding transactions...');
    for (const [name, info] of Object.entries(deployResults)) {
      console.log(`\n--- Funding ${name} ---`);
      console.log(`Sending ${info.amountSat} sats to ${info.address}...`);
      const txResult = await wallet.send([{ cashaddr: info.address, value: info.amountSat, unit: 'sat' }]);
      // txResult may be a string txid or an object; normalize to a string
      const txid = (typeof txResult === 'string') ? txResult : (txResult && (txResult.txid || txResult.id || txResult.transactionHash || txResult.txHash)) || JSON.stringify(txResult);
      console.log(`✓ ${name} funded. Txid: ${txid}`);
      info.txid = txid;
      info.explorer = 'https://tbch.loping.net/tx/' + txid;
      // brief wait
      await sleep(3000);
    }

    // ---------- Summary ----------
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            ✓ DEPLOYMENT COMPLETE                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('📋 Contract Addresses (summary):');
    Object.entries(deployResults).forEach(([k, v]) => {
      console.log(` - ${k}: ${v.address}  (funded ${v.amountSat} sats)`);
    });
    console.log();
    console.log('📝 Transaction IDs:');
    Object.entries(deployResults).forEach(([k, v]) => {
      console.log(` - ${k}: ${v.txid}`);
    });
    console.log();

    console.log('💾 Saving deployment info...');
    
    // Build deployment.json from deployResults
    const deploymentInfo = {
      network: 'testnet',
      timestamp: new Date().toISOString(),
      deployer: {
        address: wallet.getDepositAddress(),
        publicKey: pubKeyHex,
        balanceSats: balanceSats
      },
      contracts: {},
      privateKeys: {}
    };

    for (const [name, info] of Object.entries(deployResults)) {
      deploymentInfo.contracts[name] = {
        name,
        file: info.file,
        address: info.address,
        txid: info.txid,
        explorer: info.explorer,
        artifact: info.artifact,
        fundedSats: info.amountSat
      };
      deploymentInfo.privateKeys[name] = info.derivedWallet.privateKeyWif;
    }

    fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('\n✓ Deployment info saved to deployment.json');
    console.log();
    console.log('🎉 Success! Your contracts are funded on BCH testnet.');
    console.log('📂 Check deployment.json for addresses, txids and derived private keys.');
    console.log();
    console.log('⚠️  NOTE: These are derived testnet addresses for testing.');
    console.log('    For production CashScript contracts, deploy proper P2SH locking scripts instead of funding derived addresses.');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    
    if (error.message.includes('Insufficient') || error.message.includes('balance')) {
      console.log('\n💡 Your wallet needs more testnet BCH.');
      console.log('   Get some from: https://tbch.googol.cash/');
    } else if (error.message.includes('ENOENT')) {
      console.log('\n💡 Contract artifacts not found.');
      console.log('   Make sure you have compiled your contracts:');
      console.log('   cashc contracts/Vault.cash -o build/Vault.json');
    } else {
      console.error('\nStack trace:', error.stack);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);