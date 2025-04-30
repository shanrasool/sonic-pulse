export interface TransactionsResponse {
    success: boolean;
    data: {
      transactions: Array<{
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
      }>;
    };
    error?: string;
  }