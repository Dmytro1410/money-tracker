import { Budget } from '@/models/common.ts';
import { ListItem } from '@/pages/Budgets/components/BudgetList/ListItem.tsx';

export interface IChildBudgetProps {
  currency: string;
  sub: Budget;
  onEdit: (payload: Pick<Budget, 'id' | 'amount' | 'period'> & { categoryId: Budget['category_id'] }) => void;
  onDelete: (id: string) => void;
}

export function ChildBudget({
  currency,
  onDelete,
  onEdit,
  sub,
}: IChildBudgetProps) {
  const { amount, spent } = sub;
  const subPct = sub.amount > 0
    ? Math.min(100, Math.round(((sub.spent ?? 0) / sub.amount) * 100)) : 0;
  const subOver = subPct >= 100;
  const subRemain = sub.amount - (sub.spent ?? 0);
  return (
    <ListItem
      budget={sub}
      currency={currency}
      isExpanded={false}
      over={subOver}
      pct={subPct}
      remaining={subRemain}
      totalLimit={amount}
      totalSpent={spent ?? 0}
      onDeleteBudget={onDelete}
      onEdit={onEdit}
    />
  );
}
