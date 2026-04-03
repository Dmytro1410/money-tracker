import { formatCurrency, formatDate } from '@/lib/formatters.ts';
import { ITransaction } from '@/models/Transactions.ts';

export function RecentTransactions({
  currency,
  transactions,
}: { transactions: ITransaction[], currency: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-display text-sm font-semibold text-white">Последние операции</p>
        <span className="text-xs text-white/30">
          {transactions.length}
          {' '}
          за месяц
        </span>
      </div>
      <div className="card-dark divide-y divide-white/5">
        {transactions.slice(0, 6).map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: `${tx.category?.color ?? '#8b5cf6'}22` }}
            >
              {tx.category?.icon ?? (tx.type === 'income' ? '↑' : '↓')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{tx.note ?? tx.category?.name ?? '—'}</p>
              <p className="text-xs text-white/30">
                {formatDate(tx.date)}
                {' '}
                ·
                {' '}
                {tx.account?.name}
              </p>
            </div>
            <span className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
              {tx.type === 'income' ? '+' : '−'}
              {formatCurrency(tx.amount, tx.account?.currency ?? currency)}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-sm text-white/30 text-center py-8">Нет транзакций за этот месяц</p>
        )}
      </div>
    </div>
  );
}
