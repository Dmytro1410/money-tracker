import { Account } from '@/types/common.ts';

export const getTotalBalance = (accounts: Account[]) => accounts.reduce((s, a) => s + a.balance, 0);
