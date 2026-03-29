import { TransactionFilter } from '@/types';

export interface ITransactionsFiltersProps {
  filter: TransactionFilter;
  onFilter: (f: TransactionFilter) => void;
  onSearch: (s: string) => void;
  search: string;
}

const FILTERS: { value: TransactionFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'income', label: 'Доходы' },
  { value: 'expense', label: 'Расходы' },
  { value: 'transfer', label: 'Переводы' },
];

export function Filters({
  filter,
  onFilter,
  onSearch,
  search,
}: ITransactionsFiltersProps) {
  return (
    <div className="flex justify-between flex-wrap">
      <input
        className="input max-w-xs"
        placeholder="Поиск…"
        value={search}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
      />
      <div className="flex rounded-xl overflow-hidden border border-white/10 bg-night-800">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`px-3.5 py-2 text-sm transition-colors ${
              filter === f.value
                ? 'bg-violet-500 text-white font-medium'
                : 'text-white/40 hover:text-white/70'
            }`}
            type="button"
            onClick={() => {
              onFilter(f.value);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
