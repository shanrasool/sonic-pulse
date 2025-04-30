import { api } from "encore.dev/api";
import { processTxn } from "../lib";

interface GetTransactionParams {
    hash: string
}

interface Response {
    success: boolean;
    data: {
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
    } | null;
    error?: string;
}

export const getTransaction = api(
    { method: "GET", path: "/transaction/:hash", expose: true },
    async ({ hash }: GetTransactionParams): Promise<Response> => {
        const txn = await processTxn(hash)
        if (!txn) {
            return {
                success: false,
                data: null,
                error: "Transaction not found"
            }
        }
        
        return {
            success: true,
            data: {
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
                        accountKeys: txn.transaction.message.getAccountKeys().staticAccountKeys.map(key => key.toBase58()),
                        recentBlockhash: txn.transaction.message.recentBlockhash,
                        instructions: txn.transaction.message.compiledInstructions.map(ix => ({
                            programIdIndex: ix.programIdIndex,
                            accountKeyIndexes: ix.accountKeyIndexes,
                            data: Buffer.from(ix.data).toString('base64')
                        })),
                    },
                    signatures: txn.transaction.signatures
                } : null
            }
        }
    }
)