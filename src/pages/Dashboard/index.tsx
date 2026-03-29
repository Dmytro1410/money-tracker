import { useAuthStore, useUIStore } from '@/stores';
import { useAccounts, useBudgets, useTransactions } from '@/hooks';
import { DashboardComponent } from '@/pages/Dashboard/component.tsx';
import { getMonthExpense, getMonthIncome, getTotalBalance } from '@/pages/Dashboard/utils.ts';

export default function Dashboard() {
  const profile = useAuthStore((s) => s.profile);
  const { selectedMonth: month, selectedYear: year, setMonth } = useUIStore();
  const currency = profile?.currency ?? 'CAD';

  const { data: transactions = [] } = useTransactions(year, month);
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

  const handleOnPrevMonth = () => {
    if (month === 1) setMonth(year - 1, 12);
    else setMonth(year, month - 1);
  };

  const handleOnNextMonth = () => {
    if (month === 12) setMonth(year + 1, 1);
    else setMonth(year, month + 1);
  };

  return (
    <DashboardComponent
      accounts={accounts}
      budgets={budgets}
      currency={currency}
      firstName={firstName}
      month={month}
      monthExpense={monthExpense}
      monthIncome={monthIncome}
      totalBalance={totalBalance}
      transactions={transactions}
      year={year}
      onNextMonth={handleOnNextMonth}
      onPrevMonth={handleOnPrevMonth}
    />
  );
}
