export interface TransactionMeta {
    computeUnitsConsumed: number;
    err: any | null;
    fee: number;
    innerInstructions: any[];
    loadedAddresses: {
        readonly: string[];
        writable: string[];
    };
    logMessages: string[];
    postBalances: number[];
    postTokenBalances: any[];
    preBalances: number[];
    preTokenBalances: any[];
}

export interface TransactionMessage {
    header: {
        numReadonlySignedAccounts: number;
        numReadonlyUnsignedAccounts: number;
        numRequiredSignatures: number;
    };
    accountKeys: string[];
    recentBlockhash: string;
    instructions: any[];
}

export interface TransactionData {
    blockTime: number | null;
    meta: TransactionMeta | null;
    slot: number;
    transaction: {
        message: TransactionMessage;
        signatures: string[];
    } | null;
}

export interface TransactionResponse {
    success: boolean;
    data: TransactionData;
}
