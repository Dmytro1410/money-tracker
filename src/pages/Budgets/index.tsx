import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { useBudgets } from '@/hooks/Budgets.ts';
import Modal from '@/components/ui/Modal';
import AddBudgetForm from '@/modals/AddBudgetForm.tsx';
import { BudgetsComponent } from '@/pages/Budgets/component.tsx';
import { getTotalLimit, getTotalPct, getTotalSpent } from '@/pages/Budgets/utils.ts';

export default function Budgets() {
  const profile = useAuthStore((s) => s.profile);
  const currency = profile?.currency ?? 'CAD';
  const [showAdd, setShowAdd] = useState(false);

  const {
    data: budgets = { all: [], parents: [], children: [] }, isLoading,
  } = useBudgets();

  const handleOnShowAdd = () => {
    setShowAdd(true);
  };
  const handleOnHideAdd = () => {
    setShowAdd(false);
  };

  const totalLimit = getTotalLimit(budgets.parents);
  const totalSpent = getTotalSpent(budgets.children);
  const totalPct = getTotalPct({ totalLimit, totalSpent });

  return (
    <>
      <BudgetsComponent
        budgets={budgets}
        currency={currency}
        isLoading={isLoading}
        totalLimit={totalLimit}
        totalPct={totalPct}
        totalSpent={totalSpent}
        onShowAdd={handleOnShowAdd}
      />
      <Modal open={showAdd} title="New Budget" onClose={handleOnHideAdd}>
        <AddBudgetForm onClose={handleOnHideAdd} />
      </Modal>

    </>

  );
}
