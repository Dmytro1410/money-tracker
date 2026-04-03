import { creditUsagePercent, formatCurrency } from '@/lib/formatters.ts';
import { Account } from '@/models/common.ts';

const TYPE_LABELS: Record<string, string> = {
  bank: 'Банковский счёт', card: 'Кредитная карта', cash: 'Наличные', deposit: 'Вклад',
};

export interface IAccountItemProps {
  account: Account
}

export function AccountItem({ account }: IAccountItemProps) {
  return (
    <div key={account.id} className="card-dark p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-semibold flex-shrink-0"
            style={{ background: account.color ?? 'rgba(124,109,250,0.4)' }}
          >
            {account.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{account.name}</p>
            <p className="text-xs text-white/30">{TYPE_LABELS[account.type] ?? account.type}</p>
          </div>
        </div>
        <div className="text-right">
          <p
            className="font-display text-lg font-semibold"
            style={{ color: account.balance < 0 ? '#fb7185' : '#34d399' }}
          >
            {formatCurrency(account.balance, account.currency)}
          </p>
          <p className="text-xs text-white/30">{account.currency}</p>
        </div>
      </div>

      {account.credit_limit != null && account.credit_limit > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between text-xs text-white/30 mb-1.5">
            <span>Использовано лимита</span>
            <span>
              {formatCurrency(Math.abs(Math.min(0, account.balance)), account.currency)}
              {' '}
              /
              {' '}
              {formatCurrency(account.credit_limit, account.currency)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${creditUsagePercent(account.balance, account.credit_limit)}%`,
                background: creditUsagePercent(account.balance, account.credit_limit) > 80 ? '#fb7185' : '#fbbf24',
              }}
            />
          </div>
          <p className="text-xs text-white/30 mt-1">
            Доступно:
            {' '}
            {formatCurrency(account.credit_limit + Math.min(0, account.balance), account.currency)}
          </p>
        </div>
      )}
    </div>
  );
}
