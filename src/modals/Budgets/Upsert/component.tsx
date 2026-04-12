import { UpsertBudgetsFormCategories } from '@/modals/Budgets/Upsert/components/Categories.tsx';
import { MoneyInput } from '@/components/MoneyInput.tsx';
import { IUpsertBudgetsFormComponentProps } from '@/types/Budgets.ts';

export function UpsertBudgetsFormComponent({
  amount,
  error,
  finalCategory,
  isEdit,
  isPending,
  onClose,
  onDelete,
  onSetAmount,
  onSetParentCatId,
  onSetSubCatId,
  onSubmit,
  parentCatId,
  subCatId,
}: IUpsertBudgetsFormComponentProps) {
  return (
    <div className="space-y-4">
      <UpsertBudgetsFormCategories
        parentCatId={parentCatId}
        subCatId={subCatId}
        onSetParentCatId={onSetParentCatId}
        onSetSubCatId={onSetSubCatId}
      />

      <MoneyInput amount={amount} onSetAmount={onSetAmount} />

      {error && <p className="text-xs font-500 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button className="btn-ghost flex-1" type="button" onClick={onClose}>Cancel</button>
        <button
          className="btn-primary flex-1"
          disabled={isPending || !amount || !finalCategory}
          type="button"
          onClick={onSubmit}
        >
          {isPending ? 'Submitting…' : 'Create budget'}
        </button>
      </div>
      {isEdit && (
        <div className="flex gap-3 pt-1">
          <button
            className="btn-primary flex-1 bg-red-400/10 hover:bg-red-400/20 text-red-400"
            disabled={isPending}
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
