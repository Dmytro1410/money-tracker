import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

interface SubmitParams {
  type: TRANSACTION_TYPES
  amount: string
  accountId: string
  toAccountId: string
  categoryId: string | null
  date: string
  note: string
  tags: string
}

export function useAddTransaction(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitParams) => {
      const {
        accountId, amount, categoryId, date, note, tags, toAccountId, type,
      } = payload;

      const parsed = parseFloat(amount);
      if (Number.isNaN(parsed) || parsed <= 0) throw new Error('Please enter the correct amount');
      if (!accountId) throw new Error('Select account');

      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const base = {
        category_id: categoryId,
        date,
        note: note || null,
        tags: tagList,
      };

      if (type === 'transfer') {
        if (!toAccountId || toAccountId === accountId) throw new Error('Select account for transfer');

        const { data: d1, error: e1 } = await supabase
          .from('transactions')
          .insert({
            ...base,
            account_id: accountId,
            transfer_to_account_id: toAccountId,
            amount: parsed,
            type: 'transfer',
          })
          .select('id').single();
        if (e1) throw e1;

        const { data: d2, error: e2 } = await supabase
          .from('transactions')
          .insert({
            ...base,
            account_id: toAccountId,
            transfer_to_account_id: toAccountId,
            amount: parsed,
            type: 'transfer',
          })
          .select('id').single();
        if (e2) throw e2;

        await supabase.from('transactions').update({ transfer_pair_id: d2.id }).eq('id', d1.id);
        await supabase.from('transactions').update({ transfer_pair_id: d1.id }).eq('id', d2.id);
      } else {
        const { error } = await supabase.from('transactions').insert({
          ...base, account_id: accountId, amount: parsed, type,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['budgets'] });
      if (_onSuccess) _onSuccess();
    },
  });
}
