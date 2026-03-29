import { Account } from '@/types';

export const getTotalBalance = (accounts: Account[]) => accounts.reduce((s, a) => s + a.balance, 0);
