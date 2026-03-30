import { formatCurrency } from '@/lib/formatters.ts';

export interface ITransactionsSummaryProps {
  currency: string;
  totalExpense: number;
  totalIncome: number;
}

export function Summary({ currency, totalExpense, totalIncome }: ITransactionsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 h-20">
      <div className="card-dark p-4">
        <p className="text-xs text-white/30 mb-1">Доходы за период</p>
        <p
          className="font-display text-xl font-semibold text-emerald-400"
        >
          +
          {formatCurrency(totalIncome, currency)}
        </p>
      </div>
      <div className="card-dark p-4">
        <p className="text-xs text-white/30 mb-1">Расходы за период</p>
        <p className="font-display text-xl font-semibold text-white/70">
          −
          {formatCurrency(totalExpense, currency)}
        </p>
      </div>
    </div>
  );
}
