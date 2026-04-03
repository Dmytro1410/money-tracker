import { Budget, Category } from '@/models/common.ts';
import { getParentStats } from '@/pages/Budgets/utils.ts';
import { ListItem } from '@/pages/Budgets/components/BudgetList/ListItem.tsx';
import { ChildBudget } from '@/pages/Budgets/components/BudgetList/ChildBudget.tsx';

export function ParentBudget({
  budget,
  categories,
  childBudgets, currency,
  isExpanded,
  onDelete,
  onEdit,
  onExpand,
}: {
  budget: Budget;
  categories: Category[],
  childBudgets: Budget[],
  currency: string,
  isExpanded: boolean,
  onEdit: (payload: Pick<Budget, 'id' | 'amount' | 'period'> & { categoryId: Budget['category_id'] }) => void
  onExpand: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { subs, totalAmount: parentAmount, totalSpent: parentSpent } = getParentStats(
    { budget, categories, childBudgets },
  );
  const pct = parentAmount > 0 ? Math.min(100, Math.round((parentSpent / parentAmount) * 100)) : 0;
  const over = pct >= 100;
  const remaining = parentAmount - parentSpent;

  const hasSubs = subs.length > 0;

  return (
    <div key={budget.id} className="card-dark overflow-hidden">
      <ListItem
        budget={budget}
        currency={currency}
        isExpanded={isExpanded}
        over={over}
        pct={pct}
        remaining={remaining}
        totalLimit={parentAmount}
        totalSpent={parentSpent}
        onDeleteBudget={hasSubs ? undefined : onDelete}
        onEdit={hasSubs ? undefined : onEdit}
        onExpand={hasSubs ? onExpand : undefined}
      />

      {isExpanded && subs.length > 0 && (
        <div className="border-t p-4 border-white/5  bg-night-700">
          {subs.map((sub) => (
            <ChildBudget
              key={sub.id}
              currency={currency}
              sub={sub}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
