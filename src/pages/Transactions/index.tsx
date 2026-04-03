import { useMemo, useState } from 'react';
import { useAuthStore, useUIStore } from '@/stores';
import { useTransactions } from '@/hooks';
import Modal from '@/components/ui/Modal';
import TransactionForm from '@/components/modals/Transactions';
import { TransactionsComponent } from '@/pages/Transactions/component.tsx';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

export default function Transactions() {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const currency = profile?.currency ?? 'CAD';
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<TRANSACTION_TYPES>(TRANSACTION_TYPES.ALL);
  const [search, setSearch] = useState('');

  const { data: transactions = [], isLoading } = useTransactions(year, month);

  const filtered = useMemo(() => transactions.filter((tx) => {
    if (filter !== 'all' && tx.type !== filter) return false;
    return !(search && !tx.note?.toLowerCase().includes(search.toLowerCase())
      && !tx.category?.name.toLowerCase().includes(search.toLowerCase()));
  }), [transactions, filter, search]);

  const totalIncome = useMemo(() => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);

  const handleOnShowAdd = () => {
    setShowAdd(true);
  };

  const handleOnHideAdd = () => {
    setShowAdd(false);
  };

  const handleOnSearch = (s: string) => {
    setSearch(s);
  };

  const handleOnFilter = (f: TRANSACTION_TYPES) => {
    setFilter(f);
  };

  return (
    <>
      <TransactionsComponent
        currency={currency}
        filter={filter}
        filteredTransactions={filtered}
        isLoading={isLoading}
        search={search}
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        onFilter={handleOnFilter}
        onSearch={handleOnSearch}
        onShowAdd={handleOnShowAdd}
      />
      <Modal open={showAdd} title="New Transaction" width="4xl" onClose={handleOnHideAdd}>
        <TransactionForm onClose={handleOnHideAdd} />
      </Modal>
    </>
  );
}
