import { Budget, Category } from '@/models/common.ts';

export const getBudgets = ({ budgets, categories }: {
  budgets: Budget[];
  categories: Category[];
}) => {
  const childBudgets: Budget[] = [];
  const parentBudgets: Budget[] = [];
  budgets.forEach((b) => {
    const cat = categories.find((c) => c.id === b.category_id);
    if (cat?.parent_id) childBudgets.push(b);
    else parentBudgets.push(b);
  });

  return { childBudgets, parentBudgets };
};

export const getTotalLimit = (budgets: Budget[]) => budgets.reduce((s, b) => s + b.amount, 0);

export const getTotalSpent = (budgets: Budget[]) => budgets.reduce((s, b) => s + (b.spent ?? 0), 0);

export const getTotalPct = ({
  totalLimit, totalSpent,
}: {
  totalLimit: number; totalSpent: number
}) => {
  if (totalLimit > 0) {
    return Math.min(100, Math.round((totalSpent / totalLimit) * 100));
  }
  return 0;
};

export const getBudgetPct = (budget: Budget) => {
  if (budget.spent) {
    return Math.min(100, Math.round((budget.spent / budget.amount) * 100));
  }
  return 0;
};

export const getParentStats = ({
  budget,
  categories,
  childBudgets,
}: {
  budget: Budget;
  categories: Category[];
  childBudgets: Budget[];
}) => {
  const { amount, category_id: categoryId, spent } = budget;
  const subs = childBudgets.filter((b) => {
    const cat = categories.find((c) => c.id === b.category_id);
    return cat?.parent_id === categoryId;
  });
  const subSpent = getTotalSpent(subs);
  const subAmount = getTotalLimit(subs);

  const totalAmount = subAmount > 0 ? subAmount : (amount ?? 0);
  const totalSpent = subSpent > 0 ? subSpent : (spent ?? 0);
  return { subs, totalAmount, totalSpent };
};
