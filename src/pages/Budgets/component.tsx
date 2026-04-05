import { Summary } from '@/pages/Budgets/components/Summary.tsx';
import { BudgetList } from '@/pages/Budgets/components/BudgetList';
import { PageHeader } from '@/components/pageComponents/PageHeader.tsx';
import { IBudgetComponentProps } from '@/types/Budgets.ts';

export function BudgetsComponent({
  budgets,
  currency,
  isLoading,
  onShowAdd,
  totalLimit,
  totalPct,
  totalSpent,
}: IBudgetComponentProps) {
  return (
    <div className="p-4 lg:p-7 space-y-6 overflow-hidden h-full">
      <PageHeader title="Budgets" onShowModal={onShowAdd} />

      <Summary
        currency={currency}
        totalLimit={totalLimit}
        totalPct={totalPct}
        totalSpent={totalSpent}
      />

      <BudgetList
        budgets={budgets}
        currency={currency}
        isLoading={isLoading}
        onShowAdd={onShowAdd}
      />
    </div>
  );
}
