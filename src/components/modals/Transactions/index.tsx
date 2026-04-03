import { useState } from 'react';
import { useAccounts, useCategories } from '@/hooks';
import { TransactionsModalComponent } from '@/components/modals/Transactions/component.tsx';
import { useAddTransaction } from '@/hooks/Transactions.ts';
import { TABS, TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { ITransactionFormProps } from '@/models/Transactions.ts';

export default function TransactionForm({
  accountId: _accountId,
  amount: _amount,
  categoryId: _categoryId,
  date: _date,
  note: _note,
  onClose,
  parentCatId: _parentCatId,
  tags: _tags,
  toAccountId: _toAccountId,
  type: _type,
}: ITransactionFormProps) {
  const [type, setType] = useState<TRANSACTION_TYPES>(_type ?? TRANSACTION_TYPES.EXPENSE);
  const [amount, setAmount] = useState(_amount ?? '');
  const [accountId, setAccountId] = useState(_accountId ?? '');
  const [toAccountId, setToAccountId] = useState(_toAccountId ?? '');
  const [parentCatId, setParentCatId] = useState(_parentCatId ?? '');
  const [categoryId, setCategoryId] = useState(_categoryId ?? '');
  const [date, setDate] = useState(_date ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(_note ?? '');
  const [tags, setTags] = useState(_tags ?? '');

  const { data: accounts = [] } = useAccounts();
  const { data: catData } = useCategories(type);

  const parents = catData?.parents ?? [];
  const children = catData?.children ?? [];
  const subCategories = children.filter((c) => c.parent_id === parentCatId);

  const activeClass = TABS.find((t) => t.value === type)?.activeClass ?? '';
  const finalCategoryId = categoryId || parentCatId || null;

  const { error, isPending, mutate } = useAddTransaction(onClose);

  const handleOnSetType = (t: TRANSACTION_TYPES) => {
    setType(t);
    // reset all fields when changing transaction type
    setAmount('');
    setAccountId('');
    setToAccountId('');
    setParentCatId('');
    setCategoryId('');
    setDate(new Date().toISOString().slice(0, 10));
    setNote('');
    setTags('');
  };

  const handleOnSubmit = () => {
    mutate({
      accountId,
      amount,
      date,
      note,
      tags,
      toAccountId,
      type,
      categoryId: finalCategoryId,
    });
  };

  const isSubmitDisabled = () => {
    if (isPending || !accountId || !amount) return true;

    if (type === 'transfer') {
      return !toAccountId || toAccountId === accountId;
    }

    return !parentCatId || (subCategories.length > 0 ? !categoryId : !categoryId);
  };

  return (
    <TransactionsModalComponent
      accountId={accountId}
      accounts={accounts}
      activeClass={activeClass}
      amount={amount}
      categoryId={categoryId}
      date={date}
      error={error ? error.message : null}
      isPending={isPending}
      isSubmitDisabled={isSubmitDisabled}
      note={note}
      parentCatId={parentCatId}
      parents={parents}
      subCategories={subCategories}
      tags={tags}
      toAccountId={toAccountId}
      type={type}
      onClose={onClose}
      onSetAccountId={setAccountId}
      onSetAmount={setAmount}
      onSetCategoryId={setCategoryId}
      onSetDate={setDate}
      onSetNote={setNote}
      onSetParentCatyId={setParentCatId}
      onSetTags={setTags}
      onSetToAccountId={setToAccountId}
      onSetType={handleOnSetType}
      onSubmit={handleOnSubmit}
    />
  );
}
