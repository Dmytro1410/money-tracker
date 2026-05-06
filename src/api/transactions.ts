import { apiGet } from '@/api/index.ts';

const baseUrl = '/transactions';

export const getTransactions = ({ from, to }: { from: string; to: string }) => {
  const url = `${baseUrl}?from=${from}&to=${to}`;
  return apiGet({ url });
};
