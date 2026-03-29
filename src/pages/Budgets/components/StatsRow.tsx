import { formatCurrency } from '@/lib/formatters.ts';

export interface IBudgetsStatsRowProps {
  currency: string;
  limit: number;
  spent?: number;
}

export function StatsRow({
  currency,
  limit,
  spent = 0,
}: IBudgetsStatsRowProps) {
  const remaining = limit - spent;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-xs">
        <span className="text-white/30 font-500">
          Потрачено:
          {' '}
          <span
            className="text-white/60 font-700"
          >
            {formatCurrency(spent, currency)}
          </span>
        </span>
        <span className="text-white/15">·</span>
        <span className="text-white/30 font-500">
          Лимит:
          {' '}
          <span className="text-white/60 font-700">{formatCurrency(limit, currency)}</span>
        </span>
      </div>
      <span className={`text-xs font-800 ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
        {remaining < 0 ? '−' : '+'}
        {formatCurrency(Math.abs(remaining), currency)}
      </span>
    </div>
  );
}
