import { Header } from '@/pages/Transactions/components/Header.tsx';
import { Summary } from '@/pages/Transactions/components/Summary.tsx';
import { Filters } from '@/pages/Transactions/components/Filters.tsx';
import { List } from '@/pages/Transactions/components/List.tsx';
import { ITransactionsPageComponentProps } from '@/types/Transactions.ts';

export function TransactionsComponent({
  currency,
  filter,
  filteredTransactions,
  isLoading,
  onFilter,
  onSearch,
  onShowTxModal,
  search,
  totalExpense,
  totalIncome,
}: ITransactionsPageComponentProps) {
  return (
    <div className="p-4 lg:p-7 space-y-6 overflow-hidden h-full">
      <Header onShowTxModal={onShowTxModal} />
      <Summary currency={currency} totalExpense={totalExpense} totalIncome={totalIncome} />

      <Filters filter={filter} search={search} onFilter={onFilter} onSearch={onSearch} />
      <List
        currency={currency}
        filteredTransactions={filteredTransactions}
        isLoading={isLoading}
        search={search}
        onShowTxModal={onShowTxModal}
      />
    </div>
  );
}
