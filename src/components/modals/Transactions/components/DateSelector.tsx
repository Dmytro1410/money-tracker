import { ITransactionFormDateSelectorProps } from '@/models/Transactions.ts';

export function DateSelector({
  date, onSetDate,
}: ITransactionFormDateSelectorProps) {
  return (
    <div>
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Date</label>
      <input className="input" type="date" value={date} onChange={(e) => onSetDate(e.target.value)} />
    </div>
  );
}
