import { Connection, PublicKey } from "@solana/web3.js";
import { decodeIdlAccount, idlAddress } from "@coral-xyz/anchor/dist/cjs/idl";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { inflate } from "pako";

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}


export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num)
  }
  
  export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date)
  }
  
  export function determineInputType(input: string): 'address' | 'transaction' | 'invalid' {
    const cleanInput = input.trim();
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanInput)) {
      return 'address';
    }
    if (/^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(cleanInput)) {
      return 'transaction';
    }
    return 'invalid';
  }
  
  

const rpc = new Connection("https://sonic.helius-rpc.com/");
const DISCRIMINATOR_SIZE = 8;

export const fetchIdl = async (programId: string) => {
  const programKey = new PublicKey(programId);

  const baseAddress = PublicKey.findProgramAddressSync([], programKey)[0];
  const idlAddr = await idlAddress(programKey);

  const idlAccountInfo = await rpc.getAccountInfo(idlAddr);
  if (idlAccountInfo && idlAccountInfo.data) {
    const idlAccount = decodeIdlAccount(
      idlAccountInfo.data.slice(DISCRIMINATOR_SIZE),
    );
    const inflatedIdl = inflate(idlAccount.data);
    const idl = JSON.parse(utf8.decode(inflatedIdl));
    console.log({ idl });
  } else {
    console.log("No IDL Found");
  }
}
