import { formatCurrency } from '@/lib/formatters.ts';
import { Account, Transaction } from '@/types';

export function MainBalance({
  accounts, currency, monthExpense, monthIncome, totalBalance, transactions,
}: {
  accounts: Account[],
  currency: string,
  monthExpense: number
  monthIncome: number,
  totalBalance: number,
  transactions: Transaction[],
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="card-gradient col-span-2 p-6 glow-violet">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Total balance</p>
        <p className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          {formatCurrency(totalBalance, currency)}
        </p>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-white/30">Accounts</p>
            <p className="text-sm font-medium text-white/70">{accounts.length}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-xs text-white/30">Transactions</p>
            <p className="text-sm font-medium text-white/70">{transactions.length}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <div className="card-green flex-1 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Income</p>
          <p className="font-display text-xl font-semibold text-white">{formatCurrency(monthIncome, currency)}</p>
          <span className="badge-up mt-2 inline-block">this month</span>
        </div>
        <div className="card-coral flex-1 p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Расходы</p>
          <p className="font-display text-xl font-semibold text-white">{formatCurrency(monthExpense, currency)}</p>
          <span className="badge-down mt-2 inline-block">this month</span>
        </div>
      </div>
    </div>
  );
}
