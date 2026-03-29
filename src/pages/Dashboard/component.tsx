import { Header } from '@/pages/Dashboard/components/Header.tsx';
import { MainBalance } from '@/pages/Dashboard/components/MainBalance.tsx';
import { Account, Budget, Transaction } from '@/types';
import { Accounts } from '@/pages/Dashboard/components/Accounts.tsx';
import { Budgets } from '@/pages/Dashboard/components/Budgets.tsx';
import { RecentTransactions } from '@/pages/Dashboard/components/RecentTransactions.tsx';

export interface IDashboardComponentProps {
  accounts: Account[]
  budgets: { all: Budget[], childBudgets: Budget[], parentBudgets: Budget[] };
  currency: string;
  firstName: string;
  month: number;
  monthExpense: number;
  monthIncome: number;
  onNextMonth: () => void
  onPrevMonth: () => void
  totalBalance: number;
  transactions: Transaction[];
  year: number;
}

export function DashboardComponent({
  accounts,
  budgets,
  currency,
  firstName,
  month,
  monthExpense,
  monthIncome,
  onNextMonth,
  onPrevMonth,
  totalBalance,
  transactions,
  year,
}: IDashboardComponentProps) {
  return (
    <div className="container-main">
      <Header
        firstName={firstName}
        month={month}
        year={year}
        onNextMonth={onNextMonth}
        onPrevMonth={onPrevMonth}
      />
      <MainBalance
        accounts={accounts}
        currency={currency}
        monthExpense={monthExpense}
        monthIncome={monthIncome}
        totalBalance={totalBalance}
        transactions={transactions}
      />

      <div className="grid grid-cols-2 gap-6">
        <Accounts accounts={accounts} />
        <Budgets budgets={budgets} currency={currency} />
      </div>

      <RecentTransactions currency={currency} transactions={transactions} />
    </div>
  );
}
