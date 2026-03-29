import { formatCurrency } from '@/lib/formatters.ts';

export interface IBudgetsOverSpendWarningProps {
  currency: string;
  remaining: number;
}

export function OverSpendWarning({ currency, remaining }: IBudgetsOverSpendWarningProps) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2">
      <span className="text-red-400 text-sm">⚠</span>
      <p className="text-xs text-red-400 font-600">
        Перерасход:
        {' '}
        {formatCurrency(Math.abs(remaining), currency)}
      </p>
    </div>
  );
}
