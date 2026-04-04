import { useAuthStore, useUIStore } from '@/stores';
import { useAccounts, useBudgets } from '@/hooks';
import { DashboardComponent } from '@/pages/Dashboard/component.tsx';
import { getMonthExpense, getMonthIncome, getTotalBalance } from '@/pages/Dashboard/utils.ts';
import { useTransactions } from '@/hooks/Transactions.ts';

export default function Dashboard() {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year } = useUIStore();
  const currency = profile?.currency ?? 'CAD';

  const { data: transactions = [] } = useTransactions();
  const { data: accounts = [] } = useAccounts();
  const {
    data: budgets = {
      all: [], childBudgets: [], parentBudgets: [],
    },
  } = useBudgets(year, month);

  const totalBalance = getTotalBalance(accounts);
  const monthIncome = getMonthIncome(transactions);
  const monthExpense = getMonthExpense(transactions);

  const firstName = profile?.full_name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? '';

  return (
    <DashboardComponent
      accounts={accounts}
      budgets={budgets}
      currency={currency}
      firstName={firstName}
      monthExpense={monthExpense}
      monthIncome={monthIncome}
      totalBalance={totalBalance}
      transactions={transactions}
    />
  );
}
