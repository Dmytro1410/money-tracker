import { StatsRow } from '@/pages/Budgets/components/StatsRow.tsx';
import { OverSpendWarning } from '@/pages/Budgets/components/OverSpendWarning.tsx';
import { IBudgetsBudgetListItemProps } from '@/types/Budgets.ts';
import { MouseEvent } from 'react';
import { EditIconButton } from '@/components/Buttons/EditIconButton.tsx';
import { useAuthStore } from '@/stores';

export function BudgetsPageListItem({
  budget,
  isExpanded,
  onEdit,
  onExpand,
  over,
  pct,
  remaining,
  totalLimit,
  totalSpent,
}: IBudgetsBudgetListItemProps) {
  const profile = useAuthStore((s) => s.profile);
  const currency = profile?.currency ?? 'CAD';

  const handleOnExpand = (e: MouseEvent) => {
    e.stopPropagation();
    if (onExpand) onExpand(budget.id);
  };

  const handleOnEdit = () => {
    if (onEdit) onEdit(budget);
  };

  return (
    <div
      key={budget.id}
      className="card-dark p-5 group relative"
      onClick={onExpand ? handleOnExpand : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {onExpand && (
            <button
              className="btn-icon"
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
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-800 tabular-nums ${over ? 'text-red-400' : 'text-emerald-400'}`}>
            {pct}
            %
          </span>
          {onEdit && (
            <EditIconButton onEdit={handleOnEdit} />
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

      {over && (
        <OverSpendWarning currency={currency} remaining={remaining} />
      )}
    </div>
  );
}
