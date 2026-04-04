import { formatCurrency } from '@/lib/formatters.ts';
import { ITransactionsPageSummaryProps } from '@/types/Transactions.ts';

export function Summary({ currency, totalExpense, totalIncome }: ITransactionsPageSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 h-20">
      <div className="card-dark p-4">
        <p className="text-xs text-white/30 mb-1">Income for the period</p>
        <p
          className="font-display text-xl font-semibold text-emerald-400"
        >
          +
          {formatCurrency(totalIncome, currency)}
        </p>
      </div>
      <div className="card-dark p-4">
        <p className="text-xs text-white/30 mb-1">Expenses for the period</p>
        <p className="font-display text-xl font-semibold text-white/70">
          −
          {formatCurrency(totalExpense, currency)}
        </p>
      </div>
    </div>
  );
}
