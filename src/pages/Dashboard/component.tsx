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
  monthExpense: number;
  monthIncome: number;
  totalBalance: number;
  transactions: Transaction[];
}

export function DashboardComponent({
  accounts,
  budgets,
  currency,
  firstName,
  monthExpense,
  monthIncome,
  totalBalance,
  transactions,
}: IDashboardComponentProps) {
  return (
    <div className="container-main">
      <Header firstName={firstName} />
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
