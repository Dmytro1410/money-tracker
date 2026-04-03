import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  Account, AccountType, Budget, BudgetPeriod, Category, PeriodSummary, RecurRule,
} from '@/models/common.ts';
import { ITransaction } from '@/models/Transactions.ts';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

// ─── Payload types ────────────────────────────────────────────
export type AddAccountPayload = {
  balance: number
  color: string
  credit_limit: number | null
  currency: string
  name: string
  type: AccountType
  user_id: string
}

export type SubmitTransactionPayload = {
  account_id: string
  amount: number
  category_id: string | null
  date: string
  from_account_name?: string
  is_recurring: boolean
  note: string | null
  recur_end_date: string | null
  recur_rule: RecurRule | null
  tags: string[]
  to_account_id?: string
  to_account_name?: string
  type: TRANSACTION_TYPES
}

export type AddBudgetPayload = {
  amount: number
  category_id: string
  month: number | null
  parent_category_id?: string
  period: BudgetPeriod
  user_id: string
  year: number
}

export type EditBudgetPayload = {
  amount: number
  category_id: string
  edit_id?: string
  month: number | null
  parent_category_id?: string
  period: BudgetPeriod
  user_id: string
  year: number
}

export type SaveCategoryPayload = {
  color: string
  editing_id?: string
  icon: string
  name: string
  parent_id: string | null
  type: TRANSACTION_TYPES
  user_id: string
}

// ─── Transactions ────────────────────────────────────────────
export function useTransactions(year: number, month: number) {
  return useQuery({
    queryKey: ['transactions', year, month],
    queryFn: async () => {
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const from = `${year}-${String(month).padStart(2, '0')}-${firstDay.getDate()}`;
      const to = `${year}-${String(month).padStart(2, '0')}-${lastDay.getDate()}`;
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

      // Схлопываем пары трансферов в одну строку — оставляем только списание
      // (transfer_to_account_id !== account_id)
      const seenPairs = new Set<string>();
      return all.filter((tx) => {
        if (tx.type !== 'transfer') return true;
        if (seenPairs.has(tx.id)) return false;
        if (tx.transfer_pair_id) seenPairs.add(tx.transfer_pair_id);
        // Списание: to_account_id задан и не равен account_id
        return tx.transfer_to_account_id !== tx.account_id;
      });
    },
  });
}

export function useAddTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tx: Omit<ITransaction, 'id' | 'created_at' | 'account' | 'category'>) => {
      const { data, error } = await supabase.from('transactions').insert(tx).select().single();
      if (error) throw error;
      return data as ITransaction;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

// ─── Accounts ────────────────────────────────────────────────
export function useAccounts() {
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

export function useAddAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddAccountPayload) => {
      const { error } = await supabase.from('accounts').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

// ─── Categories ──────────────────────────────────────────────
export function useCategories(type: TRANSACTION_TYPES) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type === 'transfer' ? 'expense' : type)
        .order('name');
      if (error) throw error;
      const all = data as Category[];
      return {
        all,
        parents: all.filter((c) => !c.parent_id),
        children: all.filter((c) => c.parent_id),
      };
    },
  });
}

// ─── Budgets ─────────────────────────────────────────────────
export function useBudgets(year: number, month: number) {
  return useQuery({
    queryKey: ['budgets', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, category:categories!budgets_category_id_fkey(id,name,icon,color)')
        .eq('year', year).eq('month', month);
      if (error) throw error;
      return {
        all: data as Budget[],
        childBudgets: (data as Budget[])?.filter((b) => b.parent_category_id),
        parentBudgets: (data as Budget[])?.filter((b) => !b.parent_category_id),
      };
    },
  });
}

export function useUpsertBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (budget: Omit<Budget, 'id' | 'spent' | 'category'>) => {
      const { data, error } = await supabase
        .from('budgets')
        .upsert(budget, { onConflict: 'user_id,category_id,year,month' })
        .select().single();
      if (error) throw error;
      return data as Budget;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useAddBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: AddBudgetPayload) => {
      if (p.amount <= 0) throw new Error('Введите корректную сумму');
      if (!p.category_id) throw new Error('Выберите категорию');

      const base = {
        user_id: p.user_id, period: p.period, year: p.year, month: p.month,
      };

      // Автоматически создаём родительский бюджет если выбрана подкатегория
      if (p.parent_category_id) {
        const { error: parentErr } = await supabase.from('budgets').upsert(
          { ...base, category_id: p.parent_category_id, amount: 0 },
          { onConflict: 'user_id,category_id,year,month', ignoreDuplicates: true },
        );
        if (parentErr) console.warn('parent budget:', parentErr.message);
      }

      const { error } = await supabase.from('budgets').upsert(
        { ...base, category_id: p.category_id, amount: p.amount },
        { onConflict: 'user_id,category_id,year,month' },
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useEditBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: EditBudgetPayload) => {
      if (p.amount <= 0) throw new Error('Введите корректную сумму');

      if (p.edit_id) {
        const { error } = await supabase
          .from('budgets').update({ amount: p.amount, period: p.period }).eq('id', p.edit_id);
        if (error) throw error;
      } else {
        const base = {
          user_id: p.user_id, period: p.period, year: p.year, month: p.month,
        };
        if (p.parent_category_id) {
          await supabase.from('budgets').upsert(
            { ...base, category_id: p.parent_category_id, amount: 0 },
            { onConflict: 'user_id,category_id,year,month', ignoreDuplicates: true },
          );
        }
        const { error } = await supabase.from('budgets').upsert(
          { ...base, category_id: p.category_id, amount: p.amount },
          { onConflict: 'user_id,category_id,year,month' },
        );
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

// ─── Transactions (submit with transfer pair) ─────────────────
export function useSubmitTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: SubmitTransactionPayload) => {
      if (p.amount <= 0) throw new Error('Введите корректную сумму');
      if (!p.account_id) throw new Error('Выберите счёт');

      const base = {
        category_id: p.category_id,
        date: p.date,
        is_recurring: p.is_recurring,
        note: p.note,
        recur_end_date: p.recur_end_date,
        recur_rule: p.recur_rule,
        tags: p.tags,
      };

      if (p.type === 'transfer') {
        if (!p.to_account_id || p.to_account_id === p.account_id) throw new Error('Выберите счёт назначения');

        // Списание: transfer_to_account_id != account_id → триггер минусует
        const { data: d1, error: e1 } = await supabase
          .from('transactions')
          .insert({
            ...base,
            account_id: p.account_id,
            transfer_to_account_id: p.to_account_id,
            amount: p.amount,
            type: 'transfer',
            note: p.note ?? `Перевод → ${p.to_account_name}`,
          })
          .select('id').single();
        if (e1) throw e1;

        // Зачисление: transfer_to_account_id == account_id → триггер плюсует
        const { data: d2, error: e2 } = await supabase
          .from('transactions')
          .insert({
            ...base,
            account_id: p.to_account_id,
            transfer_to_account_id: p.to_account_id,
            amount: p.amount,
            type: 'transfer',
            note: p.note ?? `Перевод ← ${p.from_account_name}`,
          })
          .select('id').single();
        if (e2) throw e2;

        // Связываем пару для авто-удаления
        await supabase.from('transactions').update({ transfer_pair_id: d2.id }).eq('id', d1.id);
        await supabase.from('transactions').update({ transfer_pair_id: d1.id }).eq('id', d2.id);
      } else {
        const { error } = await supabase.from('transactions').insert({
          ...base, account_id: p.account_id, amount: p.amount, type: p.type,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

// ─── Categories (mutations) ───────────────────────────────────
export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: SaveCategoryPayload) => {
      if (!p.name.trim()) throw new Error('Введите название');
      const payload = {
        color: p.color,
        icon: p.icon,
        is_system: false,
        name: p.name.trim(),
        parent_id: p.parent_id || null,
        type: p.type,
        user_id: p.user_id,
      };
      if (p.editing_id) {
        const { error } = await supabase.from('categories').update(payload).eq('id', p.editing_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories-all'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories-all'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ─── Analytics (без Edge Function — считаем на фронте) ───────
export function useAnalytics(year: number, month: number) {
  return useQuery({
    queryKey: ['analytics', year, month],
    queryFn: async (): Promise<PeriodSummary> => {
      const from = `${year}-${String(month).padStart(2, '0')}-01`;
      const to = `${year}-${String(month).padStart(2, '0')}-31`;

      const { data, error } = await supabase
        .from('transactions')
        .select(`*,
          account:accounts!transactions_account_id_fkey(id,user_id,currency),
          category:categories(id,name,icon,color,parent_id)`)
        .gte('date', from).lte('date', to)
        .in('type', ['income', 'expense']);

      if (error) throw error;
      const txs = data as ITransaction[];

      const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      // По категориям
      const catMap = new Map<string,
        { name: string; icon: string; color: string; total: number; count: number }>();
      // eslint-disable-next-line no-restricted-syntax
      for (const tx of txs.filter((t) => t.type === 'expense' && t.category)) {
        const cat = tx.category!;
        const key = cat.id;
        const existing = catMap.get(key);
        if (existing) {
          existing.total += tx.amount;
          existing.count += 1;
        } else {
          catMap.set(key, {
            name: cat.name, icon: cat.icon, color: cat.color, total: tx.amount, count: 1,
          });
        }
      }
      const byCategory = Array.from(catMap.entries())
        .map(([id, v]) => ({
          category_id: id,
          category_name: v.name,
          category_icon: v.icon,
          category_color: v.color,
          total: v.total,
          count: v.count,
          percent: expense > 0 ? Math.round((v.total / expense) * 100 * 10) / 10 : 0,
        }))
        .sort((a, b) => b.total - a.total);

      // По дням
      const dayMap = new Map<string, { income: number; expense: number }>();
      // eslint-disable-next-line no-restricted-syntax
      for (const tx of txs) {
        const day = tx.date.slice(5).replace('-', '.'); // MM.DD
        const existing = dayMap.get(day) ?? { income: 0, expense: 0 };
        if (tx.type === 'income') existing.income += tx.amount;
        if (tx.type === 'expense') existing.expense += tx.amount;
        dayMap.set(day, existing);
      }
      const byDay = Array.from(dayMap.entries())
        .map(([date, v]) => ({ date, ...v }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        income, expense, balance: income - expense, by_category: byCategory, by_day: byDay,
      };
    },
  });
}
