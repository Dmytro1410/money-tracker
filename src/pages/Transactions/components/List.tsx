import { ListItem } from '@/pages/Transactions/components/ListItem.tsx';
import { Spinner } from '@/components/Spinner.tsx';
import { ITransactionsPageListProps } from '@/types/Transactions.ts';
import { PageEmptyList } from '@/components/pageComponents/PageEmptyList.tsx';

export function List({
  currency,
  filteredTransactions,
  isLoading,
  onResetSearch,
  onShowTxModal,
  search,
}: ITransactionsPageListProps) {
  return isLoading ? (
    <div className="w-full h-full max-h-[calc(100vh_-_400px)] xl:max-h-[calc(100vh_-_300px)]"><Spinner withText /></div>
  ) : (
    <div
      className="card-dark divide-y divide-white/5 overflow-y-auto max-h-[calc(100vh_-_400px)] xl:max-h-[calc(100vh_-_300px)]"
    >
      {filteredTransactions.map((tx) => (
        <ListItem
          key={tx.id}
          currency={currency}
          transaction={tx}
          onEdit={onShowTxModal}
        />
      ))}
      {filteredTransactions.length === 0 && (
        <PageEmptyList search={search} title="Transactions" onResetSearch={onResetSearch} onShowAdd={onShowTxModal} />
      )}
    </div>
  );
}
