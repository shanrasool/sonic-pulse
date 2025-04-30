import { getTransactionByHash } from ".";

import { useQuery } from '@tanstack/react-query';

export const useTransactionByHash = (hash: string, enabled = true) =>
  useQuery({
    queryKey: ['transaction', hash],
    queryFn: () => getTransactionByHash(hash),
    enabled: !!hash && enabled,
  });
