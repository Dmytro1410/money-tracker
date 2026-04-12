import { Category } from '@/types/common.ts';

// Budgets interfaces

export type TBudgetPeriod = 'month' | 'quarter' | 'year'

export interface IBudget {
  amount: number
  category?: Pick<Category, 'id' | 'name' | 'icon' | 'color'>
  category_id: string
  children_amount: number
  id: string
  month: number | null
  parent_category_id: string | null
  period: TBudgetPeriod
  spent?: number
  user_id: string
  year: number
}

export interface IBudgetBasePayload {
  amount: string
  categoryId: string | null
  parentCatId: string | null
}

export interface IEditBudgetPayload extends IBudgetBasePayload {
  id: string
}

// Modal interfaces

export interface IUpsertBudgetsFormProps {
  budget?: IBudget | null;
  onClose: () => void
}

export interface IUpsertBudgetsFormComponentProps extends IUpsertBudgetsFormProps {
  amount: string;
  error: string | null;
  finalCategory: string;
  isEdit: boolean;
  isPending: boolean;
  onDelete: () => void;
  onSetAmount: (amount: string) => void;
  onSetParentCatId: (parentCatId: string) => void;
  onSetSubCatId: (catId: string) => void;
  onSubmit: () => void;
  parentCatId: string;
  subCatId: string;
}

// Pages interfaces

export interface IBudgetsPageComponentProps {
  onShowBudgetModal: (budget?: IBudget) => void
}

export interface IBudgetsPageStatsRowProps {
  currency: string;
  limit: number;
  spent?: number;
}

export interface IBudgetsOverSpendWarningProps {
  currency: string
  remaining: number;
}

export type IBudgetsBudgetListProps = Pick<IBudgetsPageComponentProps, 'onShowBudgetModal'>

export interface IBudgetsBudgetListItemProps {
  budget: IBudget;
  isExpanded: boolean;
  onEdit?: (payload: IBudget) => void;
  onExpand?: (id: string) => void;
  over: boolean;
  pct: number
  remaining: number;
  totalLimit: number;
  totalSpent: number;
}
