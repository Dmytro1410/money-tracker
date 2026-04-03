import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore, useUIStore } from '@/stores';
import { useBudgets } from '@/hooks';
import Modal from '@/components/ui/Modal';
import AddBudgetForm from '@/components/modals/AddBudgetForm.tsx';
import { BudgetsComponent } from '@/pages/Budgets/component.tsx';
import { getTotalLimit, getTotalPct, getTotalSpent } from '@/pages/Budgets/utils.ts';

export default function Budgets() {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year, setMonth } = useUIStore();
  const currency = profile?.currency ?? 'CAD';
  const [showAdd, setShowAdd] = useState(false);

  const {
    data: budgets = {
      all: [], parentBudgets: [], childBudgets: [],
    }, isLoading,
  } = useBudgets(year, month);

  const qc = useQueryClient();

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });

  const handleOnDeleteBudget = (id: string) => {
    deleteBudget.mutate(id);
  };

  const handleOnNextMonth = () => {
    if (month === 12) {
      setMonth(year + 1, 1);
    } else {
      setMonth(year, month + 1);
    }
  };

  const handleOnPrevMonth = () => {
    if (month === 1) {
      setMonth(year - 1, 12);
    } else {
      setMonth(year, month - 1);
    }
  };

  const handleOnShowAdd = () => {
    setShowAdd(true);
  };
  const handleOnHideAdd = () => {
    setShowAdd(false);
  };

  const totalLimit = getTotalLimit(budgets.parentBudgets);
  const totalSpent = getTotalSpent(budgets.parentBudgets);
  const totalPct = getTotalPct({ totalLimit, totalSpent });

  return (
    <>
      <BudgetsComponent
        budgets={budgets}
        currency={currency}
        isLoading={isLoading}
        month={month}
        totalLimit={totalLimit}
        totalPct={totalPct}
        totalSpent={totalSpent}
        year={year}
        onDeleteBudget={handleOnDeleteBudget}
        onNextMonth={handleOnNextMonth}
        onPrevMonth={handleOnPrevMonth}
        onShowAdd={handleOnShowAdd}
      />
      <Modal open={showAdd} title="Новый бюджет" onClose={handleOnHideAdd}>
        <AddBudgetForm onClose={handleOnHideAdd} />
      </Modal>

    </>

  );
}
