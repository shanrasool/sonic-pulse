import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, AccountInfo, LAMPORTS_PER_SOL, ParsedAccountData, TransactionResponse } from "@solana/web3.js";
import { UserToken } from "../types";

export const RPC_CONNECTION = new Connection(
    'https://sonic.helius-rpc.com/',
    'confirmed'
);

export const getTransactionCount = async (account: string): Promise<number> => {
    const publicKey = new PublicKey(account);
    try {
        const signatures = await RPC_CONNECTION.getSignaturesForAddress(publicKey);
        return signatures.length;
    } catch (error) {
        console.error('Error fetching transaction count:', error);
        return 0;
    }
};

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

export const getAccount = async (account: string): Promise<AccountInfo<Buffer> | null> => {
    const pubkey = new PublicKey(account);
    try {
        return await RPC_CONNECTION.getAccountInfo(pubkey, "confirmed");
    } catch(err) {
        console.error("Error getting account info:", err);
        return null;
    }
};

export const getBalanceInSol = async (account: string): Promise<number> => {
    const pubkey = new PublicKey(account);
    try {
        const lamports = await RPC_CONNECTION.getBalance(pubkey, 'confirmed');
        return lamports/LAMPORTS_PER_SOL;
    } catch(err) {
        console.error("Error getting balance:", err);
        return 0;
    }
};

export const getUserTokens = async (account: string): Promise<UserToken[]> => {
    const pubkey = new PublicKey(account);
    try {
        const { value } = await RPC_CONNECTION.getParsedTokenAccountsByOwner(pubkey, {
            programId: TOKEN_PROGRAM_ID,
        });

        return value
            .map(({ account }) => {
                const data = (account.data as ParsedAccountData).parsed.info;
                return {
                    mint: data.mint as string,
                    amount: data.tokenAmount.amount as string,
                    decimals: data.tokenAmount.decimals as number,
                };
            })
            .filter((token) => token.amount !== "0");
    } catch (error) {
        console.error("Error fetching user tokens:", error);
        return [];
    }
}; 