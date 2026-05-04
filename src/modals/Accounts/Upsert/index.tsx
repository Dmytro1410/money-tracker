import { useState } from 'react';
import { useAuthStore } from '@/stores';
import type { Account, AccountType } from '@/types/common.ts';
import { AccountsFormsComponent } from '@/modals/Accounts/Upsert/component.tsx';
import { ACCOUNT_TYPES } from '@/constants/Accounts.ts';
import { useAddAccount, useDeleteAccount, useEditAccount } from '@/hooks/Accounts.ts';

interface Props {
  account?: Account;
  onClose: () => void
}

export default function AccountForm({ account, onClose }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const {
    balance: _balance,
    color: _color,
    credit_limit: _creditLimit,
    currency: _currency,
    id: accId,
    name: _name,
    type: _type = ACCOUNT_TYPES[0].value,
  } = account || {};

  const accBalance = _balance?.toString() ?? '0';
  const accCurrency = _currency ?? profile?.currency ?? 'CAD';

  const [name, setName] = useState(_name ?? '');
  const [type, setType] = useState<AccountType>(_type);
  const [balance, setBalance] = useState(accBalance);
  const [currency, setCurrency] = useState(accCurrency);
  const [creditLimit, setCreditLimit] = useState(_creditLimit?.toString() ?? '');
  const [color, setColor] = useState<string>(_color ?? '#22c55e');

  const {
    error: submitError, isPending: isSubmitPending, mutate: submitAcc,
  } = useAddAccount(onClose);

  const {
    error: editError, isPending: isEditPending, mutate: editAcc,
  } = useEditAccount(onClose);

  const {
    error: deleteError, isPending: isDeletePending, mutate: deleteAcc,
  } = useDeleteAccount(onClose);

  const handleSubmit = () => {
    const basePayload = {
      name,
      type,
      balance,
      currency,
      creditLimit,
      color,
    };
    if (accId) {
      editAcc({ ...basePayload, id: accId as string });
    } else {
      submitAcc(basePayload);
    }
  };

  const handleOnDelete = () => {
    if (accId) {
      deleteAcc({ id: accId });
    }
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

  const error = submitError || editError || deleteError;

  const isPending = isSubmitPending || isEditPending || isDeletePending;

  return (
    <AccountsFormsComponent
      balance={balance}
      color={color}
      creditLimit={creditLimit}
      currency={currency}
      error={error ? error.message : null}
      isEdit={accId !== undefined}
      isPending={isPending}
      name={name}
      type={type}
      onChangeBalance={handleOnChangeBalance}
      onChangeColor={handleOnChangeColor}
      onChangeCreditLimit={handleOnChangeCreditLimit}
      onChangeCurrency={handleOnChangeCurrency}
      onChangeName={handleOnChangeName}
      onChangeType={handleOnChangeType}
      onClose={onClose}
      onDelete={handleOnDelete}
      onSubmit={handleSubmit}
    />
  );
}
