import { clusterApiUrl, Connection } from "@solana/web3.js";
import { TransactionResponse } from "@solana/web3.js";

export const RPC_CONNECTION = new Connection(
  'https://sonic.helius-rpc.com/',
  'confirmed'
);

export const processTxn = async (signature: string): Promise<TransactionResponse | null> => {
  try {
    const tx = await RPC_CONNECTION.getTransaction(signature, { commitment: "confirmed" });
    console.log(tx);
    return tx;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error processing transaction`, {
        signature,
        error: error.message,
        stack: error.stack,
      });
    }
    return null;
  }
}