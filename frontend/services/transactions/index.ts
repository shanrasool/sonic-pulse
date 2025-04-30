import api from '@/api';
import { TransactionsResponse } from './types';

export const getTransactionsByAddress = async (address: string): Promise<TransactionsResponse> => {
  const { data } = await api.get(`/transactions/${address}`);
  return data;
};
