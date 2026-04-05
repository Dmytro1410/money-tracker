import {
  QueryClient, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { ITransaction } from '@/types/Transactions.ts';
import { useUIStore } from '@/stores';

interface ITransactionBasePayload {
  accountId: string;
  amount: string
  categoryId: string | null
  date: string
  note: string
  tags: string
  toAccountId: string
  type: TRANSACTION_TYPES;
}

interface ITransactionTransferPayload extends Omit<ITransactionBasePayload, 'amount' | 'accountId' | 'categoryId' | 'tags' | 'toAccountId'> {
  account_id: string;
  amount: number;
  category_id: string | null;
  tags: string[];
}

const createTransfer = async (
  { base, toAccountId }: { base: ITransactionTransferPayload; toAccountId: string },
) => {
  if (!toAccountId || toAccountId === base.account_id) throw new Error('Select account for transfer');

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

export function useTransactions() {
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const from = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const to = new Date(year, month, 0).toISOString().split('T')[0];
  return useQuery({
    queryKey: ['transactions', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`*,
          account:accounts!transactions_account_id_fkey(id,name,currency,color),
          to_account:accounts!transactions_transfer_to_account_id_fkey(id,name,currency,color),
          category:categories(id,name,icon,color,parent_id)`)
        .gte('date', from).lte('date', to)
        .order('date', { ascending: false });
      if (error) throw error;

      const all = data as ITransaction[];

      const seenPairs = new Set<string>();
      return all.filter((tx) => {
        if (tx.type !== 'transfer') return true;
        if (seenPairs.has(tx.id)) return false;
        if (tx.transfer_pair_id) seenPairs.add(tx.transfer_pair_id);
        return tx.transfer_to_account_id !== tx.account_id;
      });
    },
  });
}

export function useAddTransaction(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ITransactionBasePayload) => {
      const {
        accountId, amount, categoryId, date, note, tags, toAccountId, type,
      } = payload;
      const parsed = parseFloat(amount);
      baseAddEditValidation({ payload, parsed });
      const base = {
        date,
        note,
        type,
        account_id: accountId,
        amount: parsed,
        category_id: categoryId,
        tags: buildTagList(tags),
      };

      if (type === TRANSACTION_TYPES.TRANSFER) {
        await createTransfer({ base, toAccountId });
      } else {
        const { error } = await supabase.from('transactions').insert({ ...base });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateQueries(qc);
      if (_onSuccess) _onSuccess();
    },
  });
}

interface ITransactionUpdateParams extends ITransactionBasePayload {
  id: string
  pairId: string | null
}

export default function useUpdateTransactionMutation(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ITransactionUpdateParams) => {
      const {
        accountId, amount, categoryId, date, id, note, pairId, tags, toAccountId, type,
      } = payload;
      const parsed = parseFloat(amount);
      baseAddEditValidation({ payload, parsed });
      const base = {
        date,
        note,
        type,
        account_id: accountId,
        amount: parsed,
        category_id: categoryId,
        tags: buildTagList(tags),
      };
      if (type === TRANSACTION_TYPES.TRANSFER) {
        // nullify pair links to prevent auto-delete trigger from firing
        await supabase.from('transactions').update({ transfer_pair_id: null }).eq('id', id);
        await supabase.from('transactions').update({ transfer_pair_id: null }).eq('id', pairId);
        // delete both (balance trigger will roll back both accounts)
        await supabase.from('transactions').delete().eq('id', id);
        await supabase.from('transactions').delete().eq('id', pairId);
        await createTransfer({ base, toAccountId });
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
