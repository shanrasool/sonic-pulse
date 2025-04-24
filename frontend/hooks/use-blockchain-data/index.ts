import { useEffect, useRef, useState } from 'react';
import {
  Connection,
  BlockResponse,
  EpochInfo,
  InflationGovernor,
  InflationRate,
  SlotInfo
} from '@solana/web3.js';

export interface BlockchainData {
  latestBlock: BlockResponse | null;
  slotHeight: number;
  epochInfo: EpochInfo | null;
  inflationRate: InflationRate | null;
  inflationGovernor: InflationGovernor | null;
  supply: number | null;
  totalTransactions: number | null;
  tps: number | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

export const useBlockchainData = (): BlockchainData => {
  const [latestBlock, setLatestBlock] = useState<BlockResponse | null>(null);
  const [slotHeight, setSlotHeight] = useState<number>(0);
  const [epochInfo, setEpochInfo] = useState<EpochInfo | null>(null);
  const [inflationRate, setInflationRate] = useState<InflationRate | null>(null);
  const [inflationGovernor, setInflationGovernor] = useState<InflationGovernor | null>(null);
  const [supply, setSupply] = useState<number | null>(null);
  const [totalTransactions, setTotalTransactions] = useState<number | null>(null);
  const [tps, setTps] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const prevTxCountRef = useRef<number | null>(null);
  const prevTimestampRef = useRef<number | null>(null);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const connection = new Connection('https://sonic.helius-rpc.com/', 'confirmed');
      const [
        slot,
        epochInfoResult,
        inflationRateResult,
        inflationGovernorResult,
        supplyResult,
        transactionCount
      ] = await Promise.all([
        connection.getSlot(),
        connection.getEpochInfo(),
        connection.getInflationRate(),
        connection.getInflationGovernor(),
        connection.getSupply().then(res => res.value.total),
        connection.getTransactionCount()
      ]);

      setSlotHeight(slot);
      setEpochInfo(epochInfoResult);
      setInflationRate(inflationRateResult);
      setInflationGovernor(inflationGovernorResult);
      setSupply(supplyResult);
      setTotalTransactions(transactionCount);

      // TPS Calculation
      const now = Date.now();
      if (prevTxCountRef.current !== null && prevTimestampRef.current !== null) {
        const deltaTx = transactionCount - prevTxCountRef.current;
        const deltaTimeSec = (now - prevTimestampRef.current) / 1000;
        const calculatedTps = deltaTx / deltaTimeSec;
        setTps(Number(calculatedTps.toFixed(2)));
      }

      prevTxCountRef.current = transactionCount;
      prevTimestampRef.current = now;

      const blockInfo = await connection.getBlock(slot);
      setLatestBlock(blockInfo);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching Solana blockchain data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const connection = new Connection('https://sonic.helius-rpc.com/', 'confirmed');
    const slotSubscriptionId = connection.onSlotChange((slotInfo: SlotInfo) => {
      setSlotHeight(slotInfo.slot);
    });

    // Refresh TPS every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => {
      connection.removeSlotChangeListener(slotSubscriptionId);
      clearInterval(interval);
    };
  }, []);

  return {
    latestBlock,
    slotHeight,
    epochInfo,
    inflationRate,
    inflationGovernor,
    supply,
    totalTransactions,
    tps,
    isLoading,
    error,
    refreshData: fetchData
  };
};
