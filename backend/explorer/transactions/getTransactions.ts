// services/transactions.ts
import { api, Query } from "encore.dev/api";
import { RPC_CONNECTION } from "../lib";
import { PublicKey } from "@solana/web3.js";
import { processTxn } from "../lib";

interface GetTransactionsParams {
  wallet: string;
  limit?: Query<number>;
}

export const getTransactions = api(
  { method: "GET", path: "/transactions/:wallet", expose: true },
  async ({ wallet, limit }: GetTransactionsParams) => {
    const txLimit = limit ?? 30;
    if (txLimit < 1 || txLimit > 1000) {
      throw new Error("`limit` must be between 1 and 1000");
    }

    const pubkey = new PublicKey(wallet);
    const sigs = await RPC_CONNECTION.getSignaturesForAddress(pubkey, { limit: txLimit });
    
    const txns = await Promise.all(
      sigs.map((s) => processTxn(s.signature))
    );

    return {
      transactions: txns.filter(t => t !== null).map(tx => ({
        blockTime: tx?.blockTime,
        meta: tx?.meta ? {
          computeUnitsConsumed: tx.meta.computeUnitsConsumed,
          err: tx.meta.err,
          fee: tx.meta.fee,
          innerInstructions: tx.meta.innerInstructions,
          loadedAddresses: tx.meta.loadedAddresses,
          logMessages: tx.meta.logMessages,
          postBalances: tx.meta.postBalances,
          postTokenBalances: tx.meta.postTokenBalances,
          preBalances: tx.meta.preBalances,
          preTokenBalances: tx.meta.preTokenBalances
        } : null,
        slot: tx?.slot,
        transaction: tx?.transaction ? {
          message: {
            header: tx.transaction.message.header,
            accountKeys: tx.transaction.message.accountKeys.map(key => key.toString()),
            recentBlockhash: tx.transaction.message.recentBlockhash,
            instructions: tx.transaction.message.instructions,
          },
          signatures: tx.transaction.signatures
        } : null
      }))
    };
  }
);
  
