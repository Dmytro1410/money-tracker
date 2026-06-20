import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { PeriodSummary } from '@/types/common.ts';
import { ITransaction } from '@/types/Transactions.ts';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

// ─── Payload types ────────────────────────────────────────────

export type SaveCategoryPayload = {
  color: string
  editing_id?: string
  icon: string
  name: string
  parent_id: string | null
  type: TRANSACTION_TYPES
  user_id: string
}

// ─── Accounts ────────────────────────────────────────────────

// ─── Budgets ─────────────────────────────────────────────────
// export function useUpsertBudget() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (budget: Omit<Budget, 'id' | 'spent' | 'category'>) => {
//       const { data, error } = await supabase
//         .from('budgets')
//         .upsert(budget, { onConflict: 'user_id,category_id,year,month' })
//         .select().single();
//       if (error) throw error;
//       return data as Budget;
//     },
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
//   });
// }

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
