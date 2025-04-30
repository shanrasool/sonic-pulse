import { api } from "encore.dev/api";
import { PublicKey, TransactionResponse } from "@solana/web3.js";
import { processTxn, RPC_CONNECTION } from "../lib";

interface TransferTransaction {
  signature: string;
  from: string;
  to: string;
  amount: number;
  token?: string;
  timestamp: number;
}

interface Response {
  success: boolean;
  data: {
    transfers: TransferTransaction[];
  };
  error?: string;
}

export const getTransfers = api(
  { method: "GET", path: "/transfers/:wallet", expose: true },
  async ({ wallet, limit = 10 }: { wallet: string; limit?: number }): Promise<Response> => {
    const pubkey = new PublicKey(wallet);
    const sigs = await RPC_CONNECTION.getSignaturesForAddress(pubkey);
    
    const txns = await Promise.all(
      sigs.map((s) => processTxn(s.signature))
    );
    const transfers: TransferTransaction[] = [];
    
    txns.forEach((txn: TransactionResponse | null, index) => {
      if (!txn?.meta || !txn?.transaction) return;
    
      const signature = sigs[index].signature;
      const timestamp = txn.blockTime ? txn.blockTime * 1000 : Date.now();
      const meta = txn.meta;
      
      if (meta.preBalances && meta.postBalances && txn.transaction.message.accountKeys) {
        const accountKeys = txn.transaction.message.accountKeys;
        const walletIndex = accountKeys.indexOf(pubkey);
        
        if (walletIndex !== -1) {
          const preBal = meta.preBalances[walletIndex];
          const postBal = meta.postBalances[walletIndex];
          
          if (preBal !== postBal) {
            if (preBal < postBal) {
              const senderIndex = meta.preBalances.findIndex(
                (bal, i) => i !== walletIndex && meta.preBalances[i] > meta.postBalances[i]
              );
              
              if (senderIndex !== -1) {
                transfers.push({
                  signature,
                  from: accountKeys[senderIndex].toString(),
                  to: wallet,
                  amount: (postBal - preBal) / 1e9,
                  timestamp
                });
              }
            } else {
              const recipientIndex = meta.preBalances.findIndex(
                (bal, i) => i !== walletIndex && meta.preBalances[i] < meta.postBalances[i]
              );
              
              if (recipientIndex !== -1) {
                transfers.push({
                  signature,
                  from: wallet,
                  to: accountKeys[recipientIndex].toString(),
                  amount: (preBal - postBal - (meta.fee || 0)) / 1e9,
                  timestamp
                });
              }
            }
          }
        }
      }
      
      if (meta.postTokenBalances && meta.preTokenBalances) {
        const preTokens = meta.preTokenBalances;
        const postTokens = meta.postTokenBalances;
        
        const tokenBalanceMap = new Map();
        
        preTokens.forEach(preToken => {
          if (!preToken.owner || !preToken.mint) return;
          
          const key = `${preToken.owner}-${preToken.mint}`;
          tokenBalanceMap.set(key, {
            owner: preToken.owner,
            mint: preToken.mint,
            preBal: Number(preToken.uiTokenAmount?.amount || 0),
            postBal: 0,
            decimals: preToken.uiTokenAmount?.decimals || 0
          });
        });
        
        postTokens.forEach(postToken => {
          if (!postToken.owner || !postToken.mint) return;
          
          const key = `${postToken.owner}-${postToken.mint}`;
          const existing = tokenBalanceMap.get(key);
          
          if (existing) {
            existing.postBal = Number(postToken.uiTokenAmount?.amount || 0);
          } else {
            tokenBalanceMap.set(key, {
              owner: postToken.owner,
              mint: postToken.mint,
              preBal: 0,
              postBal: Number(postToken.uiTokenAmount?.amount || 0),
              decimals: postToken.uiTokenAmount?.decimals || 0
            });
          }
        });
        
        for (const [key, value] of tokenBalanceMap.entries()) {
          if (value.owner === wallet && value.preBal !== value.postBal) {
            if (value.preBal < value.postBal) {
              for (const [otherKey, otherValue] of tokenBalanceMap.entries()) {
                if (
                  otherKey !== key && 
                  otherValue.mint === value.mint && 
                  otherValue.preBal > otherValue.postBal
                ) {
                  transfers.push({
                    signature,
                    from: otherValue.owner,
                    to: wallet,
                    amount: (value.postBal - value.preBal) / Math.pow(10, value.decimals),
                    token: value.mint,
                    timestamp
                  });
                  break;
                }
              }
            } else {
              for (const [otherKey, otherValue] of tokenBalanceMap.entries()) {
                if (
                  otherKey !== key && 
                  otherValue.mint === value.mint && 
                  otherValue.preBal < otherValue.postBal
                ) {
                  transfers.push({
                    signature,
                    from: wallet,
                    to: otherValue.owner,
                    amount: (value.preBal - value.postBal) / Math.pow(10, value.decimals),
                    token: value.mint,
                    timestamp
                  });
                  break;
                }
              }
            }
          }
        }
      }

      if (meta.logMessages) {
        const transferLogs = meta.logMessages.filter(log => 
          log.includes("Transfer") || 
          log.includes("transfer") || 
          log.includes("spl-token")
        );
        if (transferLogs.length > 0 && transfers.length === 0) {
        }
      }
    });

    return {
      success: true,
      data: {
        transfers
      }
    };
  }
);