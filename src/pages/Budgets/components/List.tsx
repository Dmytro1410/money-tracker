import { IBudgetsBudgetListProps } from '@/types/Budgets.ts';
import { useGetBudgets } from '@/hooks/Budgets.ts';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { useState } from 'react';
import { getParentStats, getPct } from '@/pages/Budgets/utils.ts';
import { BudgetsPageListItem } from '@/pages/Budgets/components/ListItem.tsx';
import { PageEmptyList } from '@/components/pageComponents/PageEmptyList.tsx';
import { useGetAllCategoriesAPI } from '@/hooks/Categories.ts';

export function BudgetsPageList({ onShowBudgetModal }: IBudgetsBudgetListProps) {
  const { data: budgets, isLoading } = useGetBudgets();
  const { data: catData } = useGetAllCategoriesAPI(TRANSACTION_TYPES.EXPENSE);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { all: categories = [] } = catData || {};

  const handleOnExpand = (bId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bId)) newSet.delete(bId);
      else newSet.add(bId);
      return newSet;
    });
  };

  if (isLoading) return <p className="text-white/25 text-sm font-500 text-center py-12">Loading…</p>;

  if (budgets?.all?.length === 0) return <PageEmptyList title="Budgets" onShowAdd={onShowBudgetModal} />;

  return (
    <div
      className="space-y-4 overflow-y-auto max-h-[calc(100vh_-_330px)] xl:max-h-[calc(100vh_-_300px)]"
    >
      {budgets?.parents?.map((budget) => {
        const { subs, totalLimit, totalSpent } = getParentStats(
          { budget, categories, childBudgets: budgets?.children ?? [] },
        );
        const pct = getPct({ limit: totalLimit, spent: totalSpent });
        const hasSubs = subs.length > 0;
        const isExpanded = expandedIds.has(budget.id);
        return (
          <div key={budget.id} className="card-dark overflow-hidden">
            <BudgetsPageListItem
              budget={budget}
              isExpanded={isExpanded}
              over={pct >= 100}
              pct={pct}
              remaining={totalLimit - totalSpent}
              totalLimit={totalLimit}
              totalSpent={totalSpent}
              onEdit={hasSubs ? undefined : (payload) => {
                onShowBudgetModal(payload);
              }}
              onExpand={hasSubs ? handleOnExpand : undefined}
            />

            {isExpanded && hasSubs && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 border-t p-4 border-white/5 bg-night-700">
                {subs.map((sub) => {
                  const subPct = getPct({ limit: sub.amount, spent: sub.spent ?? 0 });
                  return (
                    <BudgetsPageListItem
                      budget={sub}
                      isExpanded={false}
                      over={subPct >= 100}
                      pct={subPct}
                      remaining={sub.amount - (sub.spent ?? 0)}
                      totalLimit={sub.amount}
                      totalSpent={sub.spent ?? 0}
                      onEdit={onShowBudgetModal}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
