import { formatCurrency, formatDate } from '@/lib/formatters.ts';
import { ITransactionsPageListItemProps } from '@/models/Transactions.ts';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';

export function ListItem({ currency, onClick, transaction }: ITransactionsPageListItemProps) {
  const getTransactionIcon = () => {
    if (transaction.category?.icon) return transaction.category.icon;

    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return '↑';
      case TRANSACTION_TYPES.EXPENSE:
        return '↓';
      case TRANSACTION_TYPES.TRANSFER:
        return '↔';
      default:
        return undefined;
    }
  };

  const getTransactionSign = () => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return '+';
      case TRANSACTION_TYPES.EXPENSE:
        return '−';
      case TRANSACTION_TYPES.TRANSFER:
        return '↔';
      default:
        return undefined;
    }
  };

  const getTransactionClassname = () => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.INCOME:
        return 'amount-income';
      case TRANSACTION_TYPES.TRANSFER:
        return 'amount-transfer';
      case TRANSACTION_TYPES.EXPENSE:
      default:
        return 'amount-expense';
    }
  };

  const getTransactionMessage = () => {
    if (transaction.type === TRANSACTION_TYPES.TRANSFER) return `${transaction.account?.name} ↔ ${transaction.to_account?.name}`;

    return `${transaction.category?.name}${transaction.note ? `-${transaction.note}` : ''}`;
  };
  return (
    <div
      key={transaction.id}
      className="flex items-center gap-3 px-4 py-3 group hover:bg-white/3 transition-colors hover:cursor-pointer hover:bg-white/5"
      onClick={() => onClick(transaction)}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: `${transaction.category?.color ?? '#8b5cf6'}22` }}
      >
        {getTransactionIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm text-white/80 truncate"
        >
          {getTransactionMessage()}
        </p>
        <p className="text-xs text-white/30">
          {formatDate(transaction.date)}
          {' '}
          ·
          {transaction.account?.name}
          {transaction.is_recurring && <span className="ml-1.5 text-violet-400">↻</span>}
          {transaction.tags.map((t) => (
            <span
              key={t}
              className="ml-1.5 inline-block bg-white/5 text-white/40 rounded px-1.5 py-0.5 text-xs"
            >
              {t}
            </span>
          ))}
        </p>
      </div>
      <span
        className={getTransactionClassname()}
      >
        {getTransactionSign()}
        {formatCurrency(transaction.amount, transaction.account?.currency ?? currency)}
      </span>

    </div>
  );
}
