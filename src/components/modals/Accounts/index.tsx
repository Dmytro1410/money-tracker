import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { useAddAccount } from '@/hooks';
import type { AccountType } from '@/models/common.ts';
import { AccountsFormsComponent } from '@/components/modals/Accounts/component.tsx';

const TYPES: { value: AccountType; label: string; icon: string }[] = [
  { value: 'bank', label: 'Банковский счёт', icon: '🏦' },
  { value: 'card', label: 'Кредитная карта', icon: '💳' },
  { value: 'cash', label: 'Наличные', icon: '💵' },
  { value: 'deposit', label: 'Вклад', icon: '📈' },
];

interface Props {
  onClose: () => void
}

export default function AddAccountForm({ onClose }: Props) {
  const profile = useAuthStore((s) => s.profile);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>(TYPES[0].value);
  const [balance, setBalance] = useState('0');
  const [currency, setCurrency] = useState(profile?.currency ?? 'CAD');
  const [creditLimit, setCreditLimit] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [error, setError] = useState<string | null>(null);

  const mutation = useAddAccount();

  const handleSubmit = () => {
    if (!name.trim()) return setError('Введите название счёта');
    setError(null);
    mutation.mutate({
      balance: parseFloat(balance) || 0,
      color,
      credit_limit: type === 'card' && creditLimit ? parseFloat(creditLimit) : null,
      currency: currency.toUpperCase(),
      name: name.trim(),
      type,
      user_id: profile!.id,
    }, { onSuccess: onClose, onError: (e: Error) => setError(e.message) });
  };

  const handleOnChangeName = (n: string) => {
    setName(n);
  };
  const handleOnChangeType = (t: AccountType) => {
    setType(t);
  };
  const handleOnChangeBalance = (b: string) => {
    setBalance(b);
  };
  const handleOnChangeCurrency = (c: string) => {
    setCurrency(c);
  };
  const handleOnChangeCreditLimit = (cl: string) => {
    setCreditLimit(cl);
  };
  const handleOnChangeColor = (col: string) => {
    setColor(col);
  };

  return (
    <AccountsFormsComponent
      balance={balance}
      color={color}
      creditLimit={creditLimit}
      currency={currency}
      error={error}
      isLoading={false}
      name={name}
      type={type}
      onChangeBalance={handleOnChangeBalance}
      onChangeColor={handleOnChangeColor}
      onChangeCreditLimit={handleOnChangeCreditLimit}
      onChangeCurrency={handleOnChangeCurrency}
      onChangeName={handleOnChangeName}
      onChangeType={handleOnChangeType}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
