import api from '@/api';
import { TransactionResponse } from './types';

export const getTransactionByHash = async (hash: string): Promise<TransactionResponse> => {
  const { data } = await api.get(`/transaction/${hash}`);
  return data;
};
