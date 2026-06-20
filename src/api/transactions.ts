import { apiGet, apiPost } from '@/api/index.ts';
import { ITransactionBasePayload } from '@/types/Transactions.ts';

const baseUrl = '/transactions';

export const getAllTransactions = ({ from, to }: { from: string; to: string }) => {
  const url = `${baseUrl}/all?from=${from}&to=${to}`;
  return apiGet({ url });
};

export const createTransaction = (body: Omit<ITransactionBasePayload, 'tags'> & { tags: string[] }) => {
  const url = `${baseUrl}`;
  return apiPost({ url, body });
};
