import { creditUsagePercent, formatCurrency } from '@/lib/formatters.ts';
import { StatsRow } from '@/pages/Budgets/components/StatsRow.tsx';
import { OverSpendWarning } from '@/pages/Budgets/components/OverSpendWarning.tsx';

export interface IBudgetsSummaryProps {
  currency: string;
  totalLimit: number;
  totalPct: number;
  totalSpent: number
}

export function Summary({
  currency,
  totalLimit,
  totalPct,
  totalSpent,
}: IBudgetsSummaryProps) {
  const over = totalPct >= 100;
  const remaining = totalLimit - (totalSpent ?? 0);

  return (
    <div className="card-gradient p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-2xs font-700 uppercase tracking-widest text-ink-800/50 mb-1">Общий бюджет</p>
          <p className="text-3xl font-900 text-ink-800 tracking-tight">{formatCurrency(totalLimit, currency)}</p>
        </div>
        <div className="text-right">
          <p className="text-2xs font-700 uppercase tracking-widest text-ink-800/50 mb-1">Потрачено</p>
          <p className="text-3xl font-900 text-ink-800 tracking-tight">{formatCurrency(totalSpent, currency)}</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/5 mb-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${totalPct}%`,
            background: creditUsagePercent(totalSpent, totalLimit) > 80 ? '#fb7185' : '#fbbf24',
          }}
        />
      </div>
      <StatsRow currency={currency} limit={totalLimit} spent={totalSpent} />

      {/* Overspend warning */}
      {over && <OverSpendWarning currency={currency} remaining={remaining} />}
    </div>
  );
}
