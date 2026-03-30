import { Transaction } from '@/types';
import { ListItem } from '@/pages/Transactions/components/ListItem.tsx';

export interface ITransactionsListProps {
  currency: string,
  filteredTransactions: Transaction[],
  isLoading: boolean,
  // onDelete: (txId: string) => void,
  onShowAdd: () => void,
  search: string,
}

export function List({
  currency,
  filteredTransactions,
  isLoading,
  // onDelete,
  onShowAdd,
  search,
}: ITransactionsListProps) {
  return isLoading ? (
    <p className="text-white/30 text-sm text-center py-10">Загрузка…</p>
  ) : (
    <div
      className="card-dark divide-y divide-white/5 overflow-y-auto max-h-[calc(100vh_-_400px)] xl:max-h-[calc(100vh_-_300px)]"
    >
      {filteredTransactions.map((tx) => (
        <ListItem currency={currency} transaction={tx} />
      ))}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/30 text-sm">{search ? 'Ничего не найдено' : 'Нет транзакций за этот период'}</p>
          {!search && (
            <button
              className="mt-3 text-violet-400 text-sm hover:text-violet-300 transition-colors"
              type="button"
              onClick={onShowAdd}
            >
              Добавить первую →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
