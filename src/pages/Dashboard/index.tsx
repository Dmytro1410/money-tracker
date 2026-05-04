import { useAuthStore } from '@/stores';
import { DashboardComponent } from '@/pages/Dashboard/component.tsx';
import { getMonthExpense, getMonthIncome, getTotalBalance } from '@/pages/Dashboard/utils.ts';
import { useGetTransactions } from '@/hooks/Transactions.ts';
import { useGetBudgets } from '@/hooks/Budgets.ts';
import { useFetchAccounts } from '@/hooks/Accounts.ts';

export default function Dashboard() {
  const { profile } = useAuthStore();
  const currency = profile?.currency ?? 'CAD';

  const { data: transactions = [] } = useGetTransactions();
  const { data: accounts = [] } = useFetchAccounts();
  const {
    data: budgets = {
      all: [], children: [], parents: [],
    },
  } = useGetBudgets();

  const totalBalance = getTotalBalance(accounts);
  const monthIncome = getMonthIncome(transactions);
  const monthExpense = getMonthExpense(transactions);

  const firstName = profile?.fullName?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? '';

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
