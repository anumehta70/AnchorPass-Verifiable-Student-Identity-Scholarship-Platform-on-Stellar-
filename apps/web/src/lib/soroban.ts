import { rpc, TransactionBuilder, Networks, Contract, xdr, Operation, Asset } from "@stellar/stellar-sdk";

const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
const CONTRACT_ID = import.meta.env.VITE_SOROBAN_CONTRACT_ID;

export const server = new rpc.Server(RPC_URL);

export async function prepareContractCall(
  publicKey: string,
  method: string,
  args: xdr.ScVal[] = [],
  payment?: { destination: string; amount: string }
): Promise<string> {
  if (!CONTRACT_ID) {
    throw new Error("Missing VITE_SOROBAN_CONTRACT_ID environment variable. Set it in .env to point to your deployed contract.");
  }

  // Get the account sequence number
  const account = await server.getAccount(publicKey);
  const contract = new Contract(CONTRACT_ID);

  // 1. Build the basic transaction with ONLY the Soroban contract call for simulation
  let simTx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  // 2. Simulate and prepare the transaction to fill in the resource footprint and exact fees
  let preparedTx = (await server.prepareTransaction(simTx)) as any;

  // 3. Rebuild the final transaction including the payment if provided
  let finalBuilder = new TransactionBuilder(account, {
    fee: preparedTx.fee,
    networkPassphrase: Networks.TESTNET,
  });

  if (payment) {
    finalBuilder.addOperation(
      Operation.payment({
        destination: payment.destination,
        asset: Asset.native(),
        amount: payment.amount,
      })
    );
  }

  // Add the prepared Soroban operation
  finalBuilder.addOperation(preparedTx.operations[0]);
  
  if (preparedTx.sorobanData) {
    finalBuilder.setSorobanData(preparedTx.sorobanData);
  }

  let finalTx = finalBuilder.setTimeout(30).build();

  return finalTx.toXDR();
}

export async function submitContractTx(signedXdr: string): Promise<string> {
  const tx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
  
  // Submit to the network
  const sendResponse = await server.sendTransaction(tx);
  
  if (sendResponse.status === "ERROR") {
    throw new Error(`Transaction failed: ${JSON.stringify(sendResponse.errorResult)}`);
  }

  // Poll for the result
  let txResponse = await server.getTransaction(sendResponse.hash);
  let retries = 0;
  
  while (txResponse.status === "NOT_FOUND" && retries < 15) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    txResponse = await server.getTransaction(sendResponse.hash);
    retries++;
  }

  if (txResponse.status === "FAILED") {
    throw new Error("Transaction execution failed on-chain.");
  }

  return sendResponse.hash;
}
