import { api } from "encore.dev/api";
import { getAccount, getTransactionCount, getBalanceInSol } from "../lib";

interface GetAccountInfoParams {
    address: string
}

export const getAccountInfo = api(
    { method: "GET", path: "/account/:address", expose: true },
    async ({ address }: GetAccountInfoParams) => {
        const [transactionCount, accountInfo, balance] = await Promise.all([
            getTransactionCount(address),
            getAccount(address),
            getBalanceInSol(address)
        ])
        
        return {
            transactionCount,
            balance,
            accountInfo: accountInfo ? {
                lamports: accountInfo.lamports,
                owner: accountInfo.owner.toString(),
                executable: accountInfo.executable,
                rentEpoch: accountInfo.rentEpoch,
                data: accountInfo.data.toString('base64')
            } : null
        }
    }
)