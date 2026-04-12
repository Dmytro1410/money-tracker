import { formatCurrency } from '@/lib/formatters.ts';
import { ITransactionsPageSummaryProps } from '@/types/Transactions.ts';

export function Summary({ currency, totalExpense, totalIncome }: ITransactionsPageSummaryProps) {
  const total = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-3 sm:grid-rows-1 gap-2 h-20 sm:h-24">
      <div className="card-gradient p-3 row-span-2 sm:row-span-1 flex flex-col justify-center">
        <p className="text-[10px] sm:text-xs text-white/30 mb-0.5 xl:hidden">Total</p>
        <p className="text-xs text-white/30 mb-1 hidden xl:block">Total for the period</p>
        <p
          className={`font-display text-base sm:text-xl font-semibold ${total > 0 ? 'text-white' : 'text-rose-400'}`}
        >
          {total > 0 ? '+' : ''}
          {formatCurrency(total, currency)}
        </p>
      </div>
      <div
        className="card-green px-3 sm:p-4 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start"
      >
        <p className="text-[10px] sm:text-xs text-white/30 xl:hidden">Income</p>
        <p className="text-xs text-white/30 hidden xl:block">Income for the period</p>
        <p className="font-display text-sm sm:text-lg font-semibold text-emerald-400">
          +
          {formatCurrency(totalIncome, currency)}
        </p>
      </div>
      <div
        className="card-coral px-3 sm:p-4 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start"
      >
        <p className="text-[10px] sm:text-xs text-white/30 xl:hidden">Exp.</p>
        <p className="text-xs text-white/30 hidden xl:block">Expenses for the period</p>
        <p className="font-display text-sm sm:text-lg font-semibold text-white/70">
          −
          {formatCurrency(totalExpense, currency)}
        </p>
      </div>
    </div>
  );
}
