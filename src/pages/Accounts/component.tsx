import { Account } from '@/models/common.ts';
import { Header } from '@/pages/Accounts/components/Header.tsx';
import { AccountItem } from '@/pages/Accounts/components/AccountItem.tsx';

export interface IAccountComponentProps {
  accounts: Account[],
  isLoading: boolean,
  totalBalance: number,
  onShowAdd: () => void,
}

export function AccountsComponent({
  accounts,
  isLoading,
  onShowAdd,
  totalBalance,
}: IAccountComponentProps) {
  return (
    <div className="p-7 space-y-6">
      <Header totalBalance={totalBalance} onShowAdd={onShowAdd} />

      {isLoading ? (
        <p className="text-white/30 text-sm text-center py-10">Загрузка…</p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account: Account) => (
            <AccountItem account={account} />
          ))}

          {accounts.length === 0 && (
            <div
              className="card-dark p-10 text-center cursor-pointer hover:bg-white/5 transition-colors"
              onClick={onShowAdd}
            >
              <p className="text-2xl mb-3">🏦</p>
              <p className="text-white/50 text-sm font-medium">Добавьте первый счёт</p>
              <p className="text-white/20 text-xs mt-1">Банковский счёт, карта, наличные или вклад</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
