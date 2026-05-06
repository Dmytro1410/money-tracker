import { useState } from 'react';
import { useCategories } from '@/hooks';
import { TransactionsModalComponent } from '@/modals/Transactions/Upsert/component.tsx';
import { useAddTransaction, useDeleteTransaction, useUpdateTransaction } from '@/hooks/Transactions.ts';
import { TABS, TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { ITransaction, ITransactionFormProps } from '@/types/Transactions.ts';
import { useFetchAccounts } from '@/hooks/Accounts.ts';

export default function TransactionForm({
  filter,
  onClose,
  transaction,
}: ITransactionFormProps) {
  const {
    accountId: txAccountId,
    categoryId: txCategoryId,
    date: txDate,
    id: txId,
    note: txNote,
    transferPairId: txPairId,
    transferToAccountId: txToAccountId,
    type: txType,
  } = (transaction || {} as ITransaction);

  const txAmount: string | undefined = transaction?.amount?.toString();
  const txParentCatId: string | undefined | null = transaction?.category?.parent_id;
  const txTags: string | undefined = transaction?.tags?.join(',');

  const [type, setType] = useState<TRANSACTION_TYPES>(txType ?? filter);
  const [amount, setAmount] = useState(txAmount ?? '');
  const [accountId, setAccountId] = useState(txAccountId ?? '');
  const [toAccountId, setToAccountId] = useState(txToAccountId ?? '');
  const [parentCatId, setParentCatId] = useState(txParentCatId ?? '');
  const [categoryId, setCategoryId] = useState(txCategoryId ?? '');
  const [date, setDate] = useState(txDate ?? new Date().toISOString());
  const [note, setNote] = useState(txNote ?? '');
  const [tags, setTags] = useState(txTags ?? '');

  const { data: accounts = [] } = useFetchAccounts();
  const { data: catData } = useCategories(type);

  const { children = [], parents = [] } = catData || {};
  const subCategories = children.filter((c) => c.parent_id === parentCatId);

  const activeClass = TABS.find((t) => t.value === type)?.activeClass ?? '';
  const finalCategoryId = categoryId || parentCatId || null;

  const {
    error: submitError, isPending: isPendingSubmit, mutate: submitTx,
  } = useAddTransaction(onClose);
  const {
    error: editError, isPending: isPendingEdit, mutate: editTx,
  } = useUpdateTransaction(onClose);
  const {
    error: deleteError, isPending: isPendingDelete, mutate: deleteTx,
  } = useDeleteTransaction(onClose);

  const isPending = isPendingSubmit || isPendingEdit || isPendingDelete;

  const error = submitError || editError || deleteError;

  const handleOnSetType = (t: TRANSACTION_TYPES) => {
    setType(t);
    // reset categories when changing transaction type
    setParentCatId('');
    setCategoryId('');
  };

  const handleOnSubmit = () => {
    const basePayload = {
      accountId, amount, date, note, tags, type, categoryId: finalCategoryId, toAccountId,
    };
    if (txId) {
      editTx({
        ...basePayload, id: txId as string, pairId: txPairId,
      });
    } else {
      submitTx({ ...basePayload });
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
