import { BudgetsPageSummary } from '@/pages/Budgets/components/Summary.tsx';
import { PageHeader } from '@/components/pageComponents/PageHeader.tsx';
import { IBudgetsPageComponentProps } from '@/types/Budgets.ts';
import { BudgetsPageList } from '@/pages/Budgets/components/List.tsx';

export function BudgetsPageComponent({
  onShowBudgetModal,

}: IBudgetsPageComponentProps) {
  return (
    <div className="p-4 lg:p-7 space-y-6 overflow-hidden h-full">
      <PageHeader title="Budgets" onShowModal={onShowBudgetModal} />
      <BudgetsPageSummary />
      <BudgetsPageList onShowBudgetModal={onShowBudgetModal} />
    </div>
  );
}
