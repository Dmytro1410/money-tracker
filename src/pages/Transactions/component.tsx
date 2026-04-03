import { Header } from '@/pages/Transactions/components/Header.tsx';
import { Summary } from '@/pages/Transactions/components/Summary.tsx';
import { Filters } from '@/pages/Transactions/components/Filters.tsx';
import { List } from '@/pages/Transactions/components/List.tsx';
import { ITransactionsPageComponentProps } from '@/models/Transactions.ts';

export function TransactionsComponent({
  currency,
  filter,
  filteredTransactions,
  isLoading,
  onFilter,
  onSearch,
  onShowAdd,
  search,
  totalExpense,
  totalIncome,
}: ITransactionsPageComponentProps) {
  return (
    <div className="p-4 lg:p-7 space-y-6 overflow-hidden h-full">
      <Header onShowAdd={onShowAdd} />
      <Summary currency={currency} totalExpense={totalExpense} totalIncome={totalIncome} />

      <Filters filter={filter} search={search} onFilter={onFilter} onSearch={onSearch} />
      <List
        currency={currency}
        filteredTransactions={filteredTransactions}
        isLoading={isLoading}
        search={search}
        onShowAdd={onShowAdd}
      />
    </div>
  );
}
