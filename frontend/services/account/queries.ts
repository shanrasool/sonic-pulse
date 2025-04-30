import { useQuery } from '@tanstack/react-query';
import { getAccountByAddress } from './index';

export const useAccountInfo = (address: string, enabled = true) =>
  useQuery({
    queryKey: ['account', address],
    queryFn: () => getAccountByAddress(address),
    enabled: !!address && enabled,
  });
