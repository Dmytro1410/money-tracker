import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase.ts';
import { Account, AccountType } from '@/types/common.ts';
import { useAuthStore } from '@/stores';

export interface IBaseAccountPayload {
  balance: string
  color: string
  creditLimit: string
  currency: string
  name: string
  type: AccountType
}

export interface IEditAccountPayload extends IBaseAccountPayload {
  id: string
}

export function useFetchAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts').select('*')
        .eq('is_archived', false).order('created_at');
      if (error) throw error;
      return data as Account[];
    },
  });
}

export function useAddAccount(_onSuccess?: () => void) {
  const profile = useAuthStore((s) => s.profile);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: IBaseAccountPayload) => {
      const {
        balance,
        color,
        creditLimit,
        currency,
        name,
        type,
      } = payload;
      if (!name || !name.trim()) throw new Error('Please enter the account name');

      const parsedBalance = parseFloat(balance) || 0;
      const parsedCreditLimit = type === 'card' && creditLimit ? parseFloat(creditLimit) : null;

      const { error } = await supabase
        .from('accounts').insert({
          color,
          type,
          balance: parsedBalance,
          credit_limit: parsedCreditLimit,
          currency: currency.toUpperCase(),
          name: name.trim(),
          user_id: profile!.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      _onSuccess?.();
    },
  });
}

export function useEditAccount(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IEditAccountPayload) => {
      const {
        balance, color, creditLimit, currency, id, name, type,
      } = payload;

      if (!name?.trim()) throw new Error('Please enter the account name');

      const parsedBalance = parseFloat(balance) || 0;
      const parsedCreditLimit = type === 'card' && creditLimit
        ? parseFloat(creditLimit)
        : null;

      // Step 1 — fetch current account to compare balance
      const { data: current, error: fetchError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;

      // Step 2 — update all account fields
      const { error: updateError } = await supabase
        .from('accounts')
        .update({
          name: name.trim(),
          balance: parsedBalance,
          currency: currency.toUpperCase(),
          color,
          credit_limit: parsedCreditLimit,
          type,
        })
        .eq('id', id);
      if (updateError) throw updateError;

      // Step 3 — create correction transaction if balance changed
      if (parsedBalance !== current.balance) {
        const { error: correctionError } = await supabase.rpc(
          'create_balance_correction',
          {
            p_account_id: id,
            p_old_balance: current.balance,
            p_new_balance: parsedBalance,
          },
        );
        if (correctionError) throw correctionError;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      _onSuccess?.();
    },
  });
}

interface DeleteAccountPayload {
  id: string
  soft?: boolean // true = archive (default), false = hard delete
}

export function useDeleteAccount(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, soft = true }: DeleteAccountPayload) => {
      if (soft) {
        // Soft delete — archive, transactions are preserved
        const { error } = await supabase
          .from('accounts')
          .update({ is_archived: true })
          .eq('id', id);
        if (error) throw error;
      } else {
        // Hard delete — cascades to transactions
        const { error } = await supabase
          .from('accounts')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      _onSuccess?.();
    },
  });
}
