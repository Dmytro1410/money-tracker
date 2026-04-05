import { useUIStore } from '@/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase.ts';
import type { Budget } from '@/types/common.ts';

export function useBudgets() {
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
      return {
        all: data as Budget[],
        children: (data as Budget[])?.filter((b) => b.parent_category_id),
        parents: (data as Budget[])?.filter((b) => !b.parent_category_id),
      };
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
      if (_onSuccess) _onSuccess();
    },
  });
}
