import { ITransactionsPageFiltersProps } from '@/types/Transactions.ts';
import { FILTERS } from '@/constants/Transactions.ts';

export function Filters({
  filter, onFilter, onSearch, search,
}: ITransactionsPageFiltersProps) {
  return (
    <div className="flex justify-between flex-wrap space-y-6 xl:space-y-0 h-26 xl:h-10">
      <input
        className="input xl:max-w-xs "
        placeholder="Search…"
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
