import { api } from "encore.dev/api";
import { processTxn } from "../lib";

interface GetTransactionParams {
    hash: string
}

export const getTransaction = api(
    { method: "GET", path: "/transaction/:hash", expose: true },
    async ({ hash }: GetTransactionParams) => {
        const txn = await processTxn(hash)
        if (!txn) {
            return null
        }
        
        return {
            blockTime: txn.blockTime,
            meta: txn.meta ? {
                computeUnitsConsumed: txn.meta.computeUnitsConsumed,
                err: txn.meta.err,
                fee: txn.meta.fee,
                innerInstructions: txn.meta.innerInstructions,
                loadedAddresses: txn.meta.loadedAddresses,
                logMessages: txn.meta.logMessages,
                postBalances: txn.meta.postBalances,
                postTokenBalances: txn.meta.postTokenBalances,
                preBalances: txn.meta.preBalances,
                preTokenBalances: txn.meta.preTokenBalances
            } : null,
            slot: txn.slot,
            transaction: txn.transaction ? {
                message: {
                    header: txn.transaction.message.header,
                    accountKeys: txn.transaction.message.accountKeys.map(key => key.toString()),
                    recentBlockhash: txn.transaction.message.recentBlockhash,
                    instructions: txn.transaction.message.instructions,
                },
                signatures: txn.transaction.signatures
            } : null
        }
    }
)