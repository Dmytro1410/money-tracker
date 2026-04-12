import { TBudgetPeriod } from '@/types/Budgets.ts';

export enum PERIOD_TYPES {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export const PERIODS: { value: TBudgetPeriod; label: string }[] = [
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
];
