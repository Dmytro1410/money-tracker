import { useState } from 'react';
import { useAccounts, useCategories } from '@/hooks';
import { TransactionsModalComponent } from '@/components/modals/Transactions/component.tsx';
import useUpdateTransactionMutation, { useAddTransaction, useDeleteTransaction } from '@/hooks/Transactions.ts';
import { TABS, TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { ITransaction, ITransactionFormProps } from '@/models/Transactions.ts';

export default function TransactionForm({
  onClose,
  transaction,
}: ITransactionFormProps) {
  const {
    account_id: txAccountId,
    category_id: txCategoryId,
    date: txDate,
    id: txId,
    note: txNote,
    transfer_to_account_id: txToAccountId,
    type: txType,
  } = (transaction || {} as ITransaction);

  const txAmount: string | undefined = transaction?.amount?.toString();
  const txParentCatId: string | undefined | null = transaction?.category?.parent_id;
  const txTags: string | undefined = transaction?.tags?.join(',');

  const [type, setType] = useState<TRANSACTION_TYPES>(txType ?? TRANSACTION_TYPES.EXPENSE);
  const [amount, setAmount] = useState(txAmount ?? '');
  const [accountId, setAccountId] = useState(txAccountId ?? '');
  const [toAccountId, setToAccountId] = useState(txToAccountId ?? '');
  const [parentCatId, setParentCatId] = useState(txParentCatId ?? '');
  const [categoryId, setCategoryId] = useState(txCategoryId ?? '');
  const [date, setDate] = useState(txDate ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(txNote ?? '');
  const [tags, setTags] = useState(txTags ?? '');

  const { data: accounts = [] } = useAccounts();
  const { data: catData } = useCategories(type);

  const parents = catData?.parents ?? [];
  const children = catData?.children ?? [];
  const subCategories = children.filter((c) => c.parent_id === parentCatId);

  const activeClass = TABS.find((t) => t.value === type)?.activeClass ?? '';
  const finalCategoryId = categoryId || parentCatId || null;

  const {
    error: submitError, isPending: isPendingSubmit, mutate: submitTx,
  } = useAddTransaction(onClose);
  const {
    error: editError, isPending: isPendingEdit, mutate: editTx,
  } = useUpdateTransactionMutation(onClose);
  const {
    error: deleteError, isPending: isPendingDelete, mutate: deleteTx,
  } = useDeleteTransaction(onClose);

  const isPending = isPendingSubmit || isPendingEdit || isPendingDelete;

  const error = submitError || editError || deleteError;

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
    const basePayload = {
      accountId, amount, date, note, tags, type, categoryId: finalCategoryId,
    };
    if (txId) {
      editTx({ ...basePayload, id: txId as string });
    } else {
      submitTx({ ...basePayload, toAccountId });
    }
  };

  const handleOnDelete = () => {
    if (txId) {
      deleteTx(txId);
    }
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
      isEdit={txId !== undefined}
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
      onDelete={handleOnDelete}
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
