import { ListItem } from '@/pages/Transactions/components/ListItem.tsx';
import { Spinner } from '@/components/Spinner.tsx';
import { ITransactionsPageListProps } from '@/models/Transactions.ts';

export function List({
  currency,
  filteredTransactions,
  isLoading,
  onShowAdd,
  search,
}: ITransactionsPageListProps) {
  return isLoading ? (
    <div className="w-full h-full max-h-[calc(100vh_-_400px)] xl:max-h-[calc(100vh_-_300px)]"><Spinner withText /></div>
  ) : (
    <div
      className="card-dark divide-y divide-white/5 overflow-y-auto max-h-[calc(100vh_-_400px)] xl:max-h-[calc(100vh_-_300px)]"
    >
      {filteredTransactions.map((tx) => (
        <ListItem key={tx.id} currency={currency} transaction={tx} />
      ))}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/30 text-sm">{search ? 'Nothing found' : 'No transactions for this period'}</p>
          {!search && (
            <button
              className="mt-3 text-violet-400 text-sm hover:text-violet-300 transition-colors"
              type="button"
              onClick={onShowAdd}
            >
              Add new →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
