import { formatMonth } from '@/lib/formatters.ts';

export interface IDashboardHeaderProps {
  firstName: string,
  month: number,
  onNextMonth: () => void,
  onPrevMonth: () => void,
  year: number,
}

export function Header({
  firstName, month, onNextMonth, onPrevMonth, year,
}: IDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="header-main">
        {firstName}
      </h1>
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
        <span
          className="text-sm text-white/60 font-medium capitalize w-36 text-center"
        >
          {formatMonth(year, month)}
        </span>
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
      </div>
    </div>
  );
}
