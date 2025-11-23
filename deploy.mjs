import { Wallet } from 'mainnet-js';
import { ElectrumNetworkProvider, Contract } from 'cashscript';
import fs from 'fs';

const CHIPNET_WIF = 'REPLACE_WITH_YOUR_CHIPNET_WIF';
const FUNDING_AMOUNT = 5000; // sats

async function deploy() {
  const wallet = new Wallet(CHIPNET_WIF);

  // Load CashScript compiled artifact (.json)
  const artifact = JSON.parse(fs.readFileSync('./build/MerchantRegistry.json', 'utf8'));

  // Use a Chipnet provider
  const provider = new ElectrumNetworkProvider('chipnet');

  // Create the contract instance with CashScript SDK
  const contract = new Contract(
    artifact,
    [],  // empty array if no constructor args
    { provider }
  );

  // Fund the contract so it has UTXOs
  const fundTx = await wallet.send([
    { cashaddr: contract.address, value: FUNDING_AMOUNT, unit: 'sat' }
  ]);

  console.log('Contract address:', contract.address);
  console.log('Funding tx:', fundTx.txid || fundTx);
  console.log('Chipnet explorer link:', `https://chipnet.blockdozer.com/tx/${fundTx.txid || fundTx}`);

  // Optionally, save deployment info
  fs.writeFileSync('MerchantRegistry-chipnet.json', JSON.stringify({
    address: contract.address,
    txid: fundTx.txid || fundTx,
    artifact
  }, null, 2));
}

deploy().catch(console.error);
