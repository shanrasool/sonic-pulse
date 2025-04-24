import { api } from "encore.dev/api";
import { PublicKey } from "@solana/web3.js";
import { RPC_CONNECTION } from "../lib";

export const getTransfers = api(
  { method: "GET", path: "/transfers/:wallet", expose: true },
  async ({ wallet, limit = 100 }: { wallet: string; limit?: number }) => {
    const pk = new PublicKey(wallet);
    let before: string | undefined;
    const transfers = [];

    while (transfers.length < limit) {
      const sigInfos = await RPC_CONNECTION.getSignaturesForAddress(pk, {
        before,
        limit: Math.min(1000, limit - transfers.length),
      });
      if (sigInfos.length === 0) break;
      before = sigInfos[sigInfos.length - 1].signature;

      for (let { signature } of sigInfos) {
        if (transfers.length >= limit) break;
        const tx = await RPC_CONNECTION.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0
        });
        if (!tx) continue;
        // filter SOL & SPL token transfers 
        const isTransfer = tx.transaction.message.instructions.some((ix) => {
          const pid = ix.programId.toString();
          const t = ('parsed' in ix) ? ix.parsed?.type : undefined;
          return (
            (pid === "11111111111111111111111111111111" && t === "transfer") ||
            (pid === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" &&
              (t === "transfer" || t === "transferChecked"))
          );
        });
        if (isTransfer) transfers.push(tx);
      }
    }

    return transfers;
  }
);
