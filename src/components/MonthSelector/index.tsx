import { useUIStore } from '@/stores';
import { DatePickerComponent } from './component.tsx';

export function MonthSelector() {
  const { selectedMonth: month, selectedYear: year, setMonth } = useUIStore();
  const handleOnPrevMonth = () => {
    if (month === 1) setMonth(year - 1, 12);
    else setMonth(year, month - 1);
  };

  const handleOnNextMonth = () => {
    if (month === 12) setMonth(year + 1, 1);
    else setMonth(year, month + 1);
  };
  return (
    <DatePickerComponent
      month={month}
      year={year}
      onNextMonth={handleOnNextMonth}
      onPrevMonth={handleOnPrevMonth}
    />
  );
}
