import { ITransactionFormDateSelectorProps } from '@/models/Transactions.ts';

export function DateSelector({
  date, onSetDate,
}: ITransactionFormDateSelectorProps) {
  return (
    <div className="w-full overflow-hidden">
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Date</label>
      <input
        className="input w-[calc(100%_-_0.875rem)]"
        type="date"
        value={date}
        onChange={(e) => onSetDate(e.target.value)}
      />
    </div>
  );
}
