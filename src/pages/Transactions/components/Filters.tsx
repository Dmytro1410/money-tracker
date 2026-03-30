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
    <div className="flex justify-between flex-wrap space-y-6 xl:space-y-0 h-26 xl:h-10">
      <input
        className="input xl:max-w-xs "
        placeholder="Поиск…"
        value={search}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
      />
      <div className="flex rounded-xl overflow-hidden border border-white/10 bg-night-800 xl:max-w-xs w-full">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`flex flex-1 px-3.5 py-2 text-sm transition-colors items-center justify-center ${
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
