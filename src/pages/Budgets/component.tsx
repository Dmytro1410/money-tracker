import { Budget } from '@/types';
import { Header } from '@/pages/Budgets/components/Header.tsx';
import { Summary } from '@/pages/Budgets/components/Summary.tsx';
import { BudgetList } from '@/pages/Budgets/components/BudgetList';

export interface IBudgetComponentProps {
  budgets: { all: Budget[], childBudgets: Budget[], parentBudgets: Budget[] };
  currency: string;
  isLoading: boolean;
  month: number;
  onDeleteBudget: (id: string) => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onShowAdd: () => void
  totalLimit: number
  totalPct: number
  totalSpent: number
  year: number
}

export function BudgetsComponent({
  budgets,
  currency,
  isLoading,
  month,
  onDeleteBudget,
  onNextMonth,
  onPrevMonth,
  onShowAdd,
  totalLimit,
  totalPct,
  totalSpent,
  year,
}: IBudgetComponentProps) {
  return (
    <div className="p-7 space-y-6">
      <Header
        month={month}
        year={year}
        onNextMonth={onNextMonth}
        onPrevMonth={onPrevMonth}
        onShowAdd={onShowAdd}
      />

      {budgets.all.length > 0 && (
        <Summary
          currency={currency}
          totalLimit={totalLimit}
          totalPct={totalPct}
          totalSpent={totalSpent}
        />
      )}

      <BudgetList
        budgets={budgets}
        currency={currency}
        isLoading={isLoading}
        onDeleteBudget={onDeleteBudget}
        onShowAdd={onShowAdd}
      />
    </div>
  );
}
