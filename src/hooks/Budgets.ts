import { useAuthStore, useUIStore } from '@/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase.ts';
import { IBudget, IBudgetBasePayload, IEditBudgetPayload } from '@/types/Budgets.ts';

const baseAddEditValidation = (
  { parsed, payload }: { payload: IBudgetBasePayload; parsed: number },
) => {
  const { categoryId } = payload;
  if (Number.isNaN(parsed) || parsed <= 0) throw new Error('Please enter the correct amount');
  if (!categoryId) throw new Error('Select a category');
};

export function useGetBudgets() {
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  return useQuery({
    queryKey: ['budgets', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, category:categories!budgets_category_id_fkey(id,name,icon,color)')
        .eq('year', year).eq('month', month)
        .order('amount', { ascending: false });
      if (error) throw error;
      return data as IBudget[];
    },
    select: (data) => ({
      all: data,
      children: data.filter((b) => b.parent_category_id),
      parents: data.filter((b) => !b.parent_category_id),
    }),
  });
}

export function useAddBudget(_onSuccess?: () => void) {
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const profile = useAuthStore((s) => s.profile);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IBudgetBasePayload) => {
      const { amount, categoryId, parentCatId } = payload;

      const parsed = parseFloat(amount);
      baseAddEditValidation({ payload, parsed });

      const base = {
        month,
        year,
        period: 'month',
        user_id: profile!.id,
      };

      if (categoryId && parentCatId) {
        const { error: parentErr } = await supabase
          .from('budgets')
          .upsert(
            { ...base, category_id: parentCatId, amount: 0 },
            { onConflict: 'user_id,category_id,year,month', ignoreDuplicates: true },
          );
        if (parentErr) console.warn('parent budget:', parentErr.message);
      }

      const { error: e } = await supabase
        .from('budgets')
        .insert(
          {
            ...base,
            category_id: categoryId,
            amount: parsed,
            parent_category_id: parentCatId ?? null,
          },
        );
      if (e) throw e;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
      _onSuccess?.();
    },
  });
}

export function useEditBudget(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IEditBudgetPayload) => {
      const {
        amount, categoryId, id, parentCatId,
      } = payload;

      const parsed = parseFloat(amount);
      baseAddEditValidation({ payload, parsed });

      const { error } = await supabase
        .from('budgets').update({
          amount: parsed,
          category_id: categoryId,
          parent_category_id: parentCatId ?? null,
        }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
      _onSuccess?.();
    },
  });
}

export function useDeleteBudget(_onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
      _onSuccess?.();
    },
  });
}
