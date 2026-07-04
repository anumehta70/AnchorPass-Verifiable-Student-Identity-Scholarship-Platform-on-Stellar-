import "dotenv/config";
import { Keypair, Networks, TransactionBuilder, Contract, xdr, rpc, Address, nativeToScVal } from "@stellar/stellar-sdk";

const server = new rpc.Server("https://soroban-testnet.stellar.org");
const CONTRACT_ID = process.env.VITE_SOROBAN_CONTRACT_ID || process.env.CONTRACT_ID || "CABA6ZABNSL3CSMYYO4IJIXTXOMECQKAT2ML5XKNZK32ZFQ4CHFLR4MT";

async function prepareContractCall(publicKey: string, method: string, args: xdr.ScVal[] = []) {
  const account = await server.getAccount(publicKey);
  const contract = new Contract(CONTRACT_ID);
  const simTx = new TransactionBuilder(account, { fee: "1000", networkPassphrase: Networks.TESTNET })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30).build();
  return (await server.prepareTransaction(simTx)).toXDR();
}

async function submitContractTx(signedXdr: string) {
  const tx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
  const sendResponse = await server.sendTransaction(tx);
  if (sendResponse.status === "ERROR") throw new Error(`Tx failed: ${JSON.stringify(sendResponse.errorResult)}`);
  
  let txResponse = await server.getTransaction(sendResponse.hash);
  let retries = 0;
  while (txResponse.status === "NOT_FOUND" && retries < 15) {
    await new Promise(r => setTimeout(r, 2000));
    txResponse = await server.getTransaction(sendResponse.hash);
    retries++;
  }
  if (txResponse.status === "FAILED") throw new Error("Tx execution failed on-chain.");
  return sendResponse.hash;
}

async function fundAccount(publicKey: string) {
  const res = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(publicKey)}`);
  if (!res.ok) throw new Error(`Friendbot failed for ${publicKey}`);
}

async function signAndSubmit(unsignedXdr: string, keypair: Keypair): Promise<string> {
  const tx = TransactionBuilder.fromXDR(unsignedXdr, Networks.TESTNET);
  tx.sign(keypair);
  return await submitContractTx(tx.toXDR());
}

async function main() {
  console.log("Generating Institution Keypair...");
  const instKeypair = Keypair.random();
  console.log(`Institution Wallet: ${instKeypair.publicKey()}`);
  
  console.log("Funding Institution via Friendbot...");
  await fundAccount(instKeypair.publicKey());
  console.log("Funded.");

  console.log("Registering Institution on-chain...");
  const regArgs = [
    Address.fromString(instKeypair.publicKey()).toScVal(),
    nativeToScVal("AnchorPass Global Academy", { type: "string" }),
  ];
  const regXdr = await prepareContractCall(instKeypair.publicKey(), "register_institution", regArgs);
  await signAndSubmit(regXdr, instKeypair);
  console.log("Institution registered!");

  const results: { student: string, txHash: string }[] = [];

  for (let i = 1; i <= 12; i++) {
    console.log(`\nProcessing Student ${i}/12...`);
    const studentKp = Keypair.random();
    
    const title = `Merit Scholarship 2026 - Cohort ${i}`;
    const hash = `QmDemoHash${i}00000000000000000000000000000000000000`;
    
    const issueArgs = [
      Address.fromString(instKeypair.publicKey()).toScVal(),
      Address.fromString(studentKp.publicKey()).toScVal(),
      nativeToScVal(title, { type: "string" }),
      nativeToScVal(hash, { type: "string" })
    ];

    try {
      const issueXdr = await prepareContractCall(instKeypair.publicKey(), "issue_credential", issueArgs);
      const txHash = await signAndSubmit(issueXdr, instKeypair);
      console.log(`Success! Tx Hash: ${txHash}`);
      results.push({ student: studentKp.publicKey(), txHash });
    } catch (e: any) {
      console.error(`Failed for student ${i}:`, e.message);
    }
  }

  const fs = await import("fs");
  const readmePath = "../../README.md";
  let table = "\n\n## Automated Credential Issuance\n\n| # | Student Wallet | Transaction Hash | Explorer Link |\n|---|----------------|------------------|---------------|\n";
  results.forEach((r, i) => {
    table += `| ${i+1} | \`${r.student}\` | \`${r.txHash.substring(0,8)}...\` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/${r.txHash}) |\n`;
  });
  
  fs.appendFileSync(readmePath, table);
  console.log("\nAppended table to README.md!");
}

main().catch(console.error);
