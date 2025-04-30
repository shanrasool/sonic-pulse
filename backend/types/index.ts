import { AccountInfo } from "@solana/web3.js";

export interface UserToken {
    mint: string;
    amount: string;
    decimals: number;
}

export interface AccountInfoResponse {
    lamports: number;
    owner: string;
    executable: boolean;
    rentEpoch: number;
    data: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

export interface AccountDetails {
    transactionCount: number;
    balance: number;
    tokens: UserToken[];
    accountInfo: AccountInfoResponse | null;
}