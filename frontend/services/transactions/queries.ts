import { useQuery } from '@tanstack/react-query';
import { getTransactionsByAddress } from './index';

export const useTransactions = (address: string, enabled = true) =>
  useQuery({
    queryKey: ['transactions', address],
    queryFn: () => getTransactionsByAddress(address),
    enabled: !!address && enabled,
  });
