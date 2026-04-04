import { Budget } from '@/types/common.ts';
import { formatCurrency } from '@/lib/formatters.ts';
import '../styles.css';
import { getPct, sortByLeftover } from '@/pages/Dashboard/utils.ts';

export interface IDashboardBudgetsProps {
  budgets: { all: Budget[], childBudgets: Budget[], parentBudgets: Budget[] }
  currency: string
}

export function Budgets({ budgets, currency }: IDashboardBudgetsProps) {
  return (
    <div>
      <div className="dashboard-section-header">
        <p className="dashboard-section-header-title">Budgets</p>
        <span className="dashboard-section-header-helper">
          {`${budgets.all.length} items`}
        </span>
      </div>
      <div className="dashboard-section-container">
        {budgets.parentBudgets.slice(0, 12).sort(sortByLeftover).map((b) => {
          const pct = getPct(b);
          const over = pct >= 100;
          return (
            <div key={b.id} className="dashboard-section-item">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">
                    {b.category?.icon}
                    {' '}
                    {b.category?.name}
                  </span>
                  <span className={`text-xs font-medium ${over ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {100 - pct}
                    %
                    (
                    {formatCurrency(b.amount - (b.spent ?? 0), currency)}
                    )
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/5">
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: over ? '#fb7185' : 'linear-gradient(90deg,#7c6dfa,#c084fc)',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {budgets.all.length === 0 && (
          <div className="card-dark p-6 text-center">
            <p className="text-white/30 text-sm">Нет бюджетов</p>
          </div>
        )}
      </div>
    </div>
  );
}
