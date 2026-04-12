import { useState } from 'react';
import { UpsertBudgetsFormComponent } from '@/modals/Budgets/Upsert/component.tsx';
import { useAddBudget, useDeleteBudget, useEditBudget } from '@/hooks/Budgets.ts';
import { IUpsertBudgetsFormProps } from '@/types/Budgets.ts';

export function UpsertBudgetsForm({ budget, onClose }: IUpsertBudgetsFormProps) {
  const {
    amount: _amount = '',
    category_id: _subCatId = '',
    parent_category_id: _parentCatId,
  } = budget || {};

  const [amount, setAmount] = useState(_amount.toString());
  const [parentCatId, setParentCatId] = useState(_parentCatId ?? '');
  const [categoryId, setCategoryId] = useState(_subCatId);

  const finalCategoryId = categoryId || parentCatId || null;

  const {
    error: submitError, isPending: isPendingSubmit, mutate: submitBudget,
  } = useAddBudget(onClose);
  const {
    error: updateError, isPending: isPendingEdit, mutate: editBudget,
  } = useEditBudget(onClose);
  const {
    error: deleteError, isPending: isDeletePending, mutate: deleteBudget,
  } = useDeleteBudget(onClose);

  const handleOnSubmit = () => {
    if (budget?.id) {
      editBudget({
        amount, parentCatId, categoryId, id: budget.id,
      });
    }
    submitBudget({ amount, parentCatId, categoryId });
  };

  const handleOnDelete = () => {
    if (budget?.id) deleteBudget(budget.id);
  };

  const error = submitError || updateError || deleteError;

  return (
    <UpsertBudgetsFormComponent
      amount={amount}
      error={error?.message ?? null}
      finalCategory={finalCategoryId || ''}
      isEdit={budget?.id !== undefined}
      isPending={isPendingSubmit || isPendingEdit || isDeletePending}
      parentCatId={parentCatId}
      subCatId={categoryId}
      onClose={onClose}
      onDelete={handleOnDelete}
      onSetAmount={setAmount}
      onSetParentCatId={setParentCatId}
      onSetSubCatId={setCategoryId}
      onSubmit={handleOnSubmit}
    />
  );
}
