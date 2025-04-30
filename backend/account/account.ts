import { api } from "encore.dev/api";
import { getAccount, getTransactionCount, getBalanceInSol, getUserTokens } from "../lib";
import { UserToken } from "../types";

interface GetAccountInfoParams {
    address: string
}

interface Response {
    success: boolean;
    data: {
        transactionCount: number;
        balance: number;
        accountInfo: {
            lamports: number;
            owner: string;
            executable: boolean;
            rentEpoch: number | undefined;
            data: string;
            accountType: "contract" | "normal";
        } | null;
        userTokens: UserToken[];
    };
    error?: string;
}

export const getAccountInfo = api(
    { method: "GET", path: "/account/:address", expose: true },
    async ({ address }: GetAccountInfoParams): Promise<Response> => {
        try {
            const [transactionCount, accountInfo, balance, userTokens] = await Promise.all([
                getTransactionCount(address),
                getAccount(address),
                getBalanceInSol(address),
                getUserTokens(address)
            ])
            
            return {
                success: true,
                data: {
                    transactionCount,
                    balance,
                    accountInfo: accountInfo ? {
                        lamports: accountInfo.lamports,
                        owner: accountInfo.owner.toString(),
                        executable: accountInfo.executable,
                        rentEpoch: accountInfo.rentEpoch,
                        data: accountInfo.data.toString('base64'),
                        accountType: accountInfo.executable ? "contract" : "normal"
                    } : null,
                    userTokens
                }
            }
        } catch (error) {
            return {
                success: false,
                data: {
                    transactionCount: 0,
                    balance: 0,
                    accountInfo: null,
                    userTokens: []
                },
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }
        }
    }
)
