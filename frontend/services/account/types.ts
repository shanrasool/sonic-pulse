export interface AccountInfo {
    data: string;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
}
  
export interface Token {
    amount: string;
    decimals: number;
    mint: string;
}
  
export interface Account {
    accountInfo: AccountInfo;
    balance: number;
    userTokens: Token[];
    transactionCount: number;
}

export interface AccountResponse {
    success: boolean;
    data: Account;
    error?: string;
}