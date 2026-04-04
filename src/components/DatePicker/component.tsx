import {
  addMonths, format, isSameDay, isSameMonth, subMonths,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import clsx from 'clsx';
import { IDatePickerComponentProps } from '@/types/common.ts';

export function DatePickerComponent({
  calendarDays,
  containerRef,
  handleSelect,
  isOpen,
  monthStart,
  selectedDate,
  setIsOpen,
  setViewDate,
  viewDate,
}: IDatePickerComponentProps) {
  return (
    <div ref={containerRef} className="w-full relative">
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
        Date
        (dd/mm/yyyy)
      </label>

      <div
        className="input flex justify-between hover:cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-white/90">
          {format(selectedDate, 'dd/MM/yyyy')}
        </span>
        <svg
          className="w-4 h-4 text-white/30 group-hover:text-purple-500 transition-colors"
          fill="none"
          stroke="#ffffffe6"
          viewBox="0 0 24 24"
        >
          <path
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-72 bg-night-700 border border-white/10 rounded-xl shadow-2xl p-4 ring-1 ring-black animate-in fade-in zoom-in duration-150"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <button className="btn-icon" type="button" onClick={() => setViewDate(subMonths(viewDate, 1))}>
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
            <span className="text-sm text-white/60 font-medium capitalize w-32 text-center">
              {format(viewDate, 'MMMM yyyy', { locale: enUS })}
            </span>
            <button className="btn-icon" type="button" onClick={() => setViewDate(addMonths(viewDate, 1))}>
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

          <div className="grid grid-cols-7 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <span
                key={d}
                className="text-[12px] font-black text-white/30 text-center uppercase tracking-tighter"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={idx}
                  className={
                    clsx(
                      'h-9 w-9 text-xs rounded-lg flex items-center justify-center',
                      isSelected && 'bg-violet-500 text-white font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)]',
                      isCurrentMonth ? 'text-white/70 hover:bg-white/5 hover:text-white' : 'text-white/10',
                      isToday && !isSelected ? 'border border-violet-500/50' : '',
                    )
                  }
                  type="button"
                  onClick={() => handleSelect(day)}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
