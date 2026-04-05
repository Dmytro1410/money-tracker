import { getParentStats } from '@/pages/Budgets/utils.ts';
import { ListItem } from '@/pages/Budgets/components/BudgetList/ListItem.tsx';
import { ChildBudget } from '@/pages/Budgets/components/BudgetList/ChildBudget.tsx';
import { IBudgetsParentBudgetProps } from '@/types/Budgets.ts';

export function ParentBudget({
  budget,
  categories,
  childBudgets, currency,
  isExpanded,
  onEdit,
  onExpand,
}: IBudgetsParentBudgetProps) {
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
        onEdit={hasSubs ? undefined : onEdit}
        onExpand={hasSubs ? onExpand : undefined}
      />

      {isExpanded && subs.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 border-t p-4 border-white/5 bg-night-700">
          {subs.map((sub) => (
            <ChildBudget
              key={sub.id}
              currency={currency}
              sub={sub}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
