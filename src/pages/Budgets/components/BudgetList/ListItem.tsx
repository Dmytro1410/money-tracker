import { Budget } from '@/models/common.ts';
import { StatsRow } from '@/pages/Budgets/components/StatsRow.tsx';
import { OverSpendWarning } from '@/pages/Budgets/components/OverSpendWarning.tsx';

export interface IBudgetListItemProps {
  budget: Budget;
  currency: string;
  isExpanded: boolean;
  onDeleteBudget?: (id: string) => void;
  onEdit?: (val: any) => void;
  onExpand?: (id: string) => void;
  over: boolean;
  pct: number
  remaining: number;
  totalLimit: number;
  totalSpent: number;
}

export function ListItem({
  budget,
  currency,
  isExpanded,
  onDeleteBudget,
  onEdit,
  onExpand,
  over,
  pct,
  remaining,
  totalLimit,
  totalSpent,
}: IBudgetListItemProps) {
  const handleOnDelete = () => {
    if (onDeleteBudget) onDeleteBudget(budget.id);
  };

  const handleOnExpand = () => {
    if (onExpand) onExpand(budget.id);
  };

  const handleOnEdit = () => {
    if (onEdit) {
      onEdit({
        id: budget.id, amount: budget.amount, period: budget.period, categoryId: budget.category_id,
      });
    }
  };

  return (
    <div
      key={budget.id}
      className="card-dark p-5 group relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {onExpand && (
            <button
              className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
              type="button"
              onClick={handleOnExpand}
            >
              <svg
                fill="none"
                height="12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}
                viewBox="0 0 24 24"
                width="12"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
          <div
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base flex-shrink-0"
          >
            {budget.category?.icon}
          </div>
          <div>
            <p className="font-700 text-white">{budget.category?.name}</p>
            <p className="text-2xs text-white/25 font-500 mt-0.5 capitalize">{budget.period}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-800 tabular-nums ${over ? 'text-red-400' : 'text-emerald-400'}`}>
            {pct}
            %
          </span>
          {onEdit && (
            <button
              className="btn-icon w-7 h-7"
              title="Редактировать"
              type="button"
              onClick={handleOnEdit}
            >
              <svg
                fill="none"
                height="12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {onDeleteBudget && (
            <button
              className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all text-sm"
              type="button"
              onClick={handleOnDelete}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="h-0.5 rounded-full bg-white/5 mb-3">
        <div
          className="h-0.5 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: pct > 80 ? '#fecdd3' : '#fde68a',
          }}
        />
      </div>

      <StatsRow currency={currency} limit={totalLimit} spent={totalSpent} />

      {/* Overspend warning */}
      {over && (
        <OverSpendWarning currency={currency} remaining={remaining} />
      )}
    </div>
  );
}
