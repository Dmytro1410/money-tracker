import {
  QueryClient, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import {
  ITransaction,
  ITransactionBasePayload,
  ITransactionTransferPayload,
  ITransactionUpdateParams,
} from '@/types/Transactions.ts';
import { useUIStore } from '@/stores';
import { createTransaction, getAllTransactions } from '@/api/transactions.ts';

const createTransfer = async (
  { base, toAccountId }: { base: ITransactionTransferPayload; toAccountId: string },
) => {
  if (!toAccountId || toAccountId === base.accountId) throw new Error('Select account for transfer');

  const { data: d1, error: e1 } = await supabase
    .from('transactions')
    .insert({ ...base, transfer_to_account_id: toAccountId })
    .select('id').single();
  if (e1) throw e1;

  const { data: d2, error: e2 } = await supabase
    .from('transactions')
    .insert({ ...base, account_id: toAccountId, transfer_to_account_id: toAccountId })
    .select('id').single();
  if (e2) throw e2;

  await supabase.from('transactions').update({ transfer_pair_id: d2.id }).eq('id', d1.id);
  await supabase.from('transactions').update({ transfer_pair_id: d1.id }).eq('id', d2.id);
};

const baseAddEditValidation = (
  { parsed, payload }: { payload: ITransactionBasePayload; parsed: number },
) => {
  const { accountId } = payload;
  if (Number.isNaN(parsed) || parsed <= 0) throw new Error('Please enter the correct amount');
  if (!accountId) throw new Error('Select an account');
};

const buildTagList = (tags: string) => tags.split(',').map((t) => t.trim()).filter(Boolean);

const invalidateQueries = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: ['transactions'] });
  qc.invalidateQueries({ queryKey: ['accounts'] });
  qc.invalidateQueries({ queryKey: ['analytics'] });
  qc.invalidateQueries({ queryKey: ['budgets'] });
};

export function useGetTransactionsAPI() {
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const from = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const to = new Date(year, month, 0).toISOString().split('T')[0];

  return useQuery({
    queryKey: ['transactions', year, month],
    queryFn: async () => {
      const { data, error } = await getAllTransactions({ from, to });
      if (error) throw error;

      return data as ITransaction[];
    },
  });
}

export function useAddTransactionAPI(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ITransactionBasePayload) => {
      const { amount, tags } = payload;
      const parsed = parseFloat(amount);
      baseAddEditValidation({ payload, parsed });

      const { error } = await createTransaction({
        ...payload,
        tags: buildTagList(tags),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries(qc);
      if (_onSuccess) _onSuccess();
    },
  });
}

export function useUpdateTransaction(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ITransactionUpdateParams) => {
      const {
        accountId, amount, categoryId, date, id, note, pairId, tags, transferToAccountId, type,
      } = payload;
      const parsed = parseFloat(amount);
      baseAddEditValidation({ payload, parsed });
      const base = {
        accountId,
        categoryId,
        date,
        note,
        type,
        amount: parsed,
        tags: buildTagList(tags),
      };
      if (type === TRANSACTION_TYPES.TRANSFER) {
        // nullify pair links to prevent auto-delete trigger from firing
        await supabase.from('transactions').update({ transfer_pair_id: null }).eq('id', id);
        await supabase.from('transactions').update({ transfer_pair_id: null }).eq('id', pairId);
        // delete both (balance trigger will roll back both accounts)
        await supabase.from('transactions').delete().eq('id', id);
        await supabase.from('transactions').delete().eq('id', pairId);
        await createTransfer({ base, toAccountId: transferToAccountId });
      }

      const { error } = await supabase
        .from('transactions')
        .update({ ...base })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries(qc);
      if (_onSuccess) _onSuccess();
    },
  });
}

export function useDeleteTransaction(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries(qc);
      if (_onSuccess) _onSuccess();
    },
  });
}
