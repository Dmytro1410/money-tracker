import { Account, Budget } from '@/types/common.ts';
import { ITransaction } from '@/types/Transactions.ts';

export const getTotalBalance = (accounts: Account[]) => accounts.reduce((s, a) => s + a.balance, 0);

export const getMonthIncome = (transactions: ITransaction[]) => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

export const getMonthExpense = (transactions: ITransaction[]) => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

export const getPct = (b: Budget) => (b.spent
  ? Math.min(100, Math.round((b.spent / b.amount) * 100)) : 0);

export const sortByLeftover = (a: Budget, b: Budget) => getPct(b) - getPct(a);
