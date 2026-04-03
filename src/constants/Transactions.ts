export enum TRANSACTION_TYPES {
  ALL = 'all',
  EXPENSE = 'expense',
  INCOME = 'income',
  TRANSFER = 'transfer',
}

export const FILTERS: { value: TRANSACTION_TYPES; label: string }[] = [
  { value: TRANSACTION_TYPES.ALL, label: 'All' },
  { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
  { value: TRANSACTION_TYPES.INCOME, label: 'Income' },
  { value: TRANSACTION_TYPES.TRANSFER, label: 'Transfer' },
];

export const TABS: { value: TRANSACTION_TYPES; label: string; activeClass: string }[] = [
  { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense', activeClass: 'text-red-400 bg-red-400/10' },
  { value: TRANSACTION_TYPES.INCOME, label: 'Income', activeClass: 'text-emerald-400 bg-emerald-400/10' },
  { value: TRANSACTION_TYPES.TRANSFER, label: 'Transfer', activeClass: 'text-white bg-white/10' },
];
