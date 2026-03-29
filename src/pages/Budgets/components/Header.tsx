import { formatMonth } from '@/lib/formatters.ts';

export interface IBudgetsHeaderProps {
  month: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onShowAdd: () => void;
  year: number;
}

export function Header({
  month,
  onNextMonth,
  onPrevMonth,
  onShowAdd,
  year,
}: IBudgetsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-800 text-white tracking-tight">Бюджеты</h1>

      </div>
      <div className="flex items-center gap-2">
        <button className="btn-icon" type="button" onClick={onPrevMonth}>
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="14"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-700 text-white/60 capitalize w-36 text-center">{formatMonth(year, month)}</span>
        <button className="btn-icon" type="button" onClick={onNextMonth}>
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="14"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button className="btn-primary ml-2" type="button" onClick={onShowAdd}>
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          Добавить
        </button>
      </div>
    </div>
  );
}
