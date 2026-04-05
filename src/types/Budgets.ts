import { Budget, Category } from '@/types/common.ts';

export interface IBudgetComponentProps {
  budgets: { all: Budget[], children: Budget[], parents: Budget[] };
  currency: string;
  isLoading: boolean;
  onShowAdd: () => void
  totalLimit: number
  totalPct: number
  totalSpent: number
}

export type IBudgetsSummaryProps = Pick<IBudgetComponentProps, 'currency' | 'totalLimit' | 'totalPct' | 'totalSpent'>

export interface IBudgetsStatsRowProps extends Pick<IBudgetComponentProps, 'currency'> {
  limit: number;
  spent?: number;
}

export interface IBudgetsOverSpendWarningProps extends Pick<IBudgetComponentProps, 'currency'> {
  remaining: number;
}

export type IBudgetsBudgetListProps = Pick<IBudgetComponentProps, 'budgets' | 'currency' | 'isLoading' | 'onShowAdd'>

export type TBudgetEditPayload = Pick<Budget, 'id' | 'amount' | 'period'> & { categoryId: Budget['category_id'] }

export interface IBudgetsParentBudgetProps extends Pick<IBudgetComponentProps, 'currency'> {
  budget: Budget;
  categories: Category[],
  childBudgets: Budget[],
  isExpanded: boolean,
  onEdit: (payload: TBudgetEditPayload) => void
  onExpand: (id: string) => void;
}

export interface IBudgetsBudgetListItemProps extends Pick<IBudgetsParentBudgetProps, 'budget' | 'currency' | 'isExpanded'> {
  onEdit?: (payload: TBudgetEditPayload) => void;
  onExpand?: (id: string) => void;
  over: boolean;
  pct: number
  remaining: number;
  totalLimit: number;
  totalSpent: number;
}

export interface IBudgetsChildBudgetProps extends Pick<IBudgetsParentBudgetProps, 'currency' | 'onEdit'> {
  sub: Budget;

}
