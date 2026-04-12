import { Account } from '@/types/common.ts';
import { ITransaction } from '@/types/Transactions.ts';
import { IBudget } from '@/types/Budgets.ts';

export const getTotalBalance = (accounts: Account[]) => accounts.reduce((s, a) => s + a.balance, 0);

export const getMonthIncome = (transactions: ITransaction[]) => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

export const getMonthExpense = (transactions: ITransaction[]) => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

export const getPct = (b: IBudget) => (b.spent
  ? Math.min(100, Math.round((b.spent / b.amount) * 100)) : 0);

export const sortByLeftover = (a: IBudget, b: IBudget) => getPct(b) - getPct(a);
