import { api, Query } from "encore.dev/api";
import { RPC_CONNECTION, processTxn } from "../lib";
import { PublicKey } from "@solana/web3.js";

interface GetTransactionsParams {
  wallet: string;
  limit?: Query<number>;
}

interface Response {
  success: boolean;
  data: {
    transactions: Array<{
      blockTime: number | null | undefined;
      meta: {
        computeUnitsConsumed: number | undefined;
        err: any;
        fee: number;
        innerInstructions: any[] | null | undefined;
        loadedAddresses: any;
        logMessages: string[] | null | undefined;
        postBalances: number[] | null | undefined;
        postTokenBalances: any[] | null | undefined;
        preBalances: number[] | null | undefined;
        preTokenBalances: any[] | null | undefined;
      } | null;
      slot: number;
      transaction: {
        message: {
          header: any;
          accountKeys: string[];
          recentBlockhash: string;
          instructions: any[];
        };
        signatures: string[];
      } | null;
    }>;
  };
  error?: string;
}

export const getTransactions = api(
  { method: "GET", path: "/transactions/:wallet", expose: true },
  async ({ wallet, limit }: GetTransactionsParams): Promise<Response> => {
    const txLimit = limit ?? 30;
    if (txLimit < 1 || txLimit > 1000) {
      return {
        success: false,
        data: { transactions: [] },
        error: "`limit` must be between 1 and 1000"
      };
    }

    const pubkey = new PublicKey(wallet);
    const sigs = await RPC_CONNECTION.getSignaturesForAddress(pubkey, { limit: txLimit });
    
    const txns = await Promise.all(
      sigs.map((s) => processTxn(s.signature))
    );

    return {
      success: true,
      data: {
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
      }
    };
  }
);
  