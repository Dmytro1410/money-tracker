import { Account, Category, RecurRule } from '@/models/common.ts';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

// Transaction interfaces

export interface ITransaction {
  account?: Pick<Account, 'id' | 'name' | 'currency' | 'color'>
  account_id: string
  amount: number
  category?: Pick<Category, 'id' | 'name' | 'icon' | 'color' | 'parent_id'>
  category_id: string | null
  created_at: string
  date: string
  id: string
  imported_hash: string | null
  is_recurring: boolean
  note: string | null
  recur_end_date: string | null
  recur_rule: RecurRule | null
  tags: string[]
  to_account?: Pick<Account, 'id' | 'name' | 'currency' | 'color'>
  transfer_pair_id: string | null
  transfer_to_account_id: string | null
  type: TRANSACTION_TYPES
}

// Modal interfaces

export interface ITransactionFormProps {
  transaction?: ITransaction | null;
  onClose: () => void
}

export interface ITransactionFormComponentProps {
  accountId: string;
  accounts: Account[];
  activeClass: string;
  amount: string;
  categoryId: string;
  date: string;
  error: string | null;
  isEdit: boolean;
  isPending: boolean;
  isSubmitDisabled: () => boolean;
  note: string;
  onClose: () => void;
  onDelete: () => void;
  onSetAccountId: (id: string) => void;
  onSetAmount: (amount: string) => void;
  onSetCategoryId: (id: string) => void;
  onSetDate: (date: string) => void;
  onSetNote: (note: string) => void;
  onSetParentCatyId: (id: string) => void;
  onSetTags: (tag: string) => void;
  onSetToAccountId: (id: string) => void;
  onSetType: (type: TRANSACTION_TYPES) => void;
  onSubmit: () => void;
  parentCatId: string;
  parents: Category[];
  subCategories: Category[];
  tags: string;
  toAccountId: string;
  type: TRANSACTION_TYPES
}

export type ITransactionFormAccountsProps = Pick<
  ITransactionFormComponentProps,
  'accountId' | 'accounts' | 'onSetAccountId' | 'onSetToAccountId' | 'toAccountId' | 'type'
>

export type ITransactionFormAmountProps = Pick<
  ITransactionFormComponentProps, 'accountId' | 'accounts' | 'amount' | 'onSetAmount'
>;

export type ITransactionFormCategoriesProps = Pick<
  ITransactionFormComponentProps, 'activeClass' | 'categoryId' | 'parentCatId' | 'parents' | 'subCategories' | 'onSetCategoryId' | 'onSetParentCatyId'
>;

export type ITransactionFormDateSelectorProps = Pick<
  ITransactionFormComponentProps, 'date' | 'onSetDate'
>;

export type ITransactionFormNoteEditorProps = Pick<
  ITransactionFormComponentProps, 'note' | 'onSetNote'
>;

export type ITransactionFormTagsEditorProps = Pick<
  ITransactionFormComponentProps, 'tags' | 'onSetTags'
>

export type ITransactionFormTypeSelectorProps = Pick<
  ITransactionFormComponentProps, 'type' | 'onSetType'
>;

// Page interfaces

export interface ITransactionsPageComponentProps {
  currency: string,
  filter: TRANSACTION_TYPES,
  filteredTransactions: ITransaction[]
  isLoading: boolean,
  onFilter: (f: TRANSACTION_TYPES) => void,
  onSearch: (s: string) => void,
  onShowTxModal: (tx?: ITransaction) => void,
  search: string,
  totalExpense: number,
  totalIncome: number,
}

export type ITransactionsPageFiltersProps = Pick<
  ITransactionsPageComponentProps, 'filter' | 'search' | 'onFilter' | 'onSearch'
>

export type ITransactionsPageHeaderProps = Pick<
  ITransactionsPageComponentProps, 'onShowTxModal'
>

export type ITransactionsPageListItemProps = Pick<ITransactionsPageComponentProps, 'currency'> & {
  transaction: ITransaction,
  onClick: (tx?: ITransaction) => void,
}

export type ITransactionsPageListProps = Pick<
  ITransactionsPageComponentProps, 'currency' | 'filteredTransactions' | 'isLoading' | 'search' | 'onShowTxModal'
>

export type ITransactionsPageSummaryProps = Pick<
  ITransactionsPageComponentProps, 'currency' | 'totalExpense' | 'totalIncome'
>
