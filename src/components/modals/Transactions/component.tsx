import { TypeSelector } from '@/components/modals/Transactions/components/TypeSelector.tsx';
import { TABS } from '@/constants/Transactions.ts';
import { Amount } from '@/components/modals/Transactions/components/Amount.tsx';
import { Accounts } from '@/components/modals/Transactions/components/Accounts.tsx';
import { Categories } from '@/components/modals/Transactions/components/Categories.tsx';
import { DateSelector } from '@/components/modals/Transactions/components/DateSelector.tsx';
import { NoteEditor } from '@/components/modals/Transactions/components/NoteEditor.tsx';
import { TagsEditor } from '@/components/modals/Transactions/components/TagsEditor.tsx';
import { ITransactionFormComponentProps } from '@/models/Transactions.ts';

export function TransactionsModalComponent({
  accountId,
  accounts,
  activeClass,
  amount,
  categoryId,
  date,
  error,
  isPending,
  isSubmitDisabled,
  note,
  onClose,
  onSetAccountId,
  onSetAmount,
  onSetCategoryId,
  onSetDate,
  onSetNote,
  onSetParentCatyId,
  onSetTags,
  onSetToAccountId,
  onSetType,
  onSubmit,
  parentCatId,
  parents,
  subCategories,
  tags,
  toAccountId,
  type,
}: ITransactionFormComponentProps) {
  return (
    <div className="space-y-4">
      <TypeSelector type={type} onSetType={onSetType} />

      <Amount
        accountId={accountId}
        accounts={accounts}
        amount={amount}
        onSetAmount={onSetAmount}
      />

      <Accounts
        accountId={accountId}
        accounts={accounts}
        toAccountId={toAccountId}
        type={type}
        onSetAccountId={onSetAccountId}
        onSetToAccountId={onSetToAccountId}
      />

      {type !== 'transfer' && (
        <Categories
          activeClass={activeClass}
          categoryId={categoryId}
          parentCatId={parentCatId}
          parents={parents}
          subCategories={subCategories}
          onSetCategoryId={onSetCategoryId}
          onSetParentCatyId={onSetParentCatyId}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <DateSelector date={date} onSetDate={onSetDate} />
        <NoteEditor note={note} onSetNote={onSetNote} />
      </div>

      <TagsEditor tags={tags} onSetTags={onSetTags} />

      {error && (
        <p className="text-xs font-500 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button className="btn-ghost flex-1" type="button" onClick={onClose}>Cancel</button>
        <button
          className="btn-primary flex-1"
          disabled={isSubmitDisabled()}
          type="button"
          onClick={onSubmit}
        >
          {isPending ? 'Submitting…' : `Add ${TABS.find((t) => t.value === type)?.label.toLowerCase()}`}
        </button>
      </div>
    </div>
  );
}
