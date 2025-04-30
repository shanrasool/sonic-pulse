import api from '@/api';
import { AccountResponse } from './types';

export const getAccountByAddress = async (address: string): Promise<AccountResponse> => {
  const { data } = await api.get(`/account/${address}`);
  console.log(address)
  console.log(data)
  return data;
};
