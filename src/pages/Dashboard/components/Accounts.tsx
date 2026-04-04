import { Account } from '@/types/common.ts';
import { formatCurrency } from '@/lib/formatters.ts';
import '../styles.css';

export interface IDashboardAccountsProps {
  accounts: Account[]
}

export function Accounts({ accounts }: IDashboardAccountsProps) {
  return (
    <div>
      <div className="dashboard-section-header">
        <p className="dashboard-section-header-title">Accounts</p>
        <span className="dashboard-section-header-helper">
          {`${accounts.length} items`}
        </span>
      </div>
      <div className="dashboard-section-container">
        {accounts.slice(0, 12).map((acc: Account) => (
          <div key={acc.id} className="dashboard-section-item">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 text-white"
              style={{ background: acc.color ?? 'rgba(124,109,250,0.3)' }}
            >
              {acc.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{acc.name}</p>
              <p className="text-xs text-white/30 capitalize">{acc.type}</p>
            </div>
            <p
              className="font-display text-sm font-semibold"
              style={{ color: acc.balance < 0 ? '#fb7185' : '#34d399' }}
            >
              {formatCurrency(acc.balance, acc.currency)}
            </p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="card-dark p-6 text-center">
            <p className="text-white/30 text-sm">Нет счетов</p>
          </div>
        )}
      </div>
    </div>
  );
}
