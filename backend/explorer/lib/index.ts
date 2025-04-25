import { Connection, PublicKey, AccountInfo, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TransactionResponse } from "@solana/web3.js";

export const RPC_CONNECTION = new Connection(
  'https://api.mainnet-beta.solana.com',
  'confirmed'
);

export const processTxn = async (signature: string): Promise<TransactionResponse | null> => {
  try {
    const tx = await RPC_CONNECTION.getTransaction(signature, { commitment: "confirmed" });
    console.log(tx?.meta?.innerInstructions);
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

export const getTransactionCount = async (account: string): Promise<number> => {
  const publicKey = new PublicKey(account);

  try {
    const signatures = await RPC_CONNECTION.getSignaturesForAddress(publicKey);
    return signatures.length === 0 ? 0 : (await RPC_CONNECTION.getSignaturesForAddress(publicKey)).length;
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    return 0;
  }
};

export const getAccount = async (account: string): Promise<AccountInfo<Buffer> | null> => {
  const pubkey = new PublicKey(account);
  try {
    return await RPC_CONNECTION.getAccountInfo(pubkey, "confirmed");
  } catch(err) {
    console.error("Error getting account info")
    return null
  }
}

export const getBalanceInSol = async (account: string): Promise<number> => {
  const pubkey = new PublicKey(account)

  try {
    const lamports = await RPC_CONNECTION.getBalance(pubkey, 'confirmed')
    const balance = lamports/LAMPORTS_PER_SOL
    return balance
  } catch(err) {
    console.log(err)
    return 0
  }
}