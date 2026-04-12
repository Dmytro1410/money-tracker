import { Category } from '@/types/common.ts';
import { IBudget } from '@/types/Budgets.ts';

export const getTotalLimit = (bds: IBudget[]) => bds.reduce((s, b) => s + b.amount, 0);

export const getTotalSpent = (bds: IBudget[]) => bds.reduce((s, b) => s + (b.spent ?? 0), 0);

export const getPct = ({
  limit, spent,
}: {
  limit: number; spent: number
}) => {
  if (limit > 0) {
    return Math.min(100, Math.round((spent / limit) * 100));
  }
  return 0;
};

export const getParentStats = ({
  budget,
  categories,
  childBudgets,
}: {
  budget: IBudget;
  categories: Category[];
  childBudgets: IBudget[];
}) => {
  const { amount, category_id: categoryId, spent } = budget;
  const subs = childBudgets.filter((b) => {
    const cat = categories.find((c) => c.id === b.category_id);
    return cat?.parent_id === categoryId;
  });
  const subSpent = getTotalSpent(subs);
  const subLimit = getTotalLimit(subs);

  const totalLimit = subLimit > 0 ? subLimit : (amount ?? 0);
  const totalSpent = subSpent > 0 ? subSpent : (spent ?? 0);
  return { subs, totalLimit, totalSpent };
};
