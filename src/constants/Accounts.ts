import { AccountType } from '@/types/common.ts';

export const TYPE_LABELS: Record<string, string> = {
  bank: 'Bank account', card: 'Credit card', cash: 'Cash', deposit: 'Deposit',
};

export const ACCOUNT_TYPES: { value: AccountType; label: string; icon: string }[] = [
  { value: 'bank', label: 'Bank account', icon: '🏦' },
  { value: 'card', label: 'Credit card', icon: '💳' },
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'deposit', label: 'Deposit', icon: '📈' },
];
