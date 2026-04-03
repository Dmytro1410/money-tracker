import { formatMonth } from '@/lib/formatters.ts';

export interface IDatePickerComponentProps {
  month: number;
  year: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

export function DatePickerComponent({
  month, onNextMonth, onPrevMonth, year,
}: IDatePickerComponentProps) {
  return (
    <div className="flex items-center gap-0 xl:gap-2">
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
        className="text-sm text-white/60 font-medium capitalize w-32 text-center"
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
  );
}
