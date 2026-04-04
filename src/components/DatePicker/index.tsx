import { useEffect, useRef, useState } from 'react';
import {
  eachDayOfInterval, endOfMonth, endOfWeek, format, parseISO, startOfMonth, startOfWeek,
} from 'date-fns';
import { DatePickerComponent } from '@/components/DatePicker/component.tsx';
import { IDatePickerProps } from '@/types/common.ts';

export function DatePicker({ date, onSetDate }: IDatePickerProps) {
  const selectedDate = date ? parseISO(date) : new Date();

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleSelect = (day: Date) => {
    onSetDate(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  return (
    <DatePickerComponent
      calendarDays={calendarDays}
      containerRef={containerRef}
      handleSelect={handleSelect}
      isOpen={isOpen}
      monthStart={monthStart}
      selectedDate={selectedDate}
      setIsOpen={setIsOpen}
      setViewDate={setViewDate}
      viewDate={viewDate}
    />
  );
}
