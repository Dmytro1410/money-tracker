import { Account } from '@/types/common.ts';
import { AccountItem } from '@/pages/Accounts/components/AccountItem.tsx';
import { IAccountComponentProps } from '@/types/Accounts.ts';
import { PageHeader } from '@/components/pageComponents/PageHeader.tsx';

export function AccountsComponent({
  accounts,
  isLoading,
  onShowModal,
  totalBalance,
}: IAccountComponentProps) {
  return (
    <div className="p-7 space-y-6">
      <PageHeader title="Accounts" totalBalance={totalBalance} onShowModal={onShowModal} />

      {isLoading ? (
        <p className="text-white/30 text-sm text-center py-10">Loading…</p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account: Account) => (
            <AccountItem account={account} onEdit={onShowModal} />
          ))}

          {accounts.length === 0 && (
            <div
              className="card-dark p-10 text-center cursor-pointer hover:bg-white/5 transition-colors"
              onClick={onShowModal}
            >
              <p className="text-2xl mb-3">🏦</p>
              <p className="text-white/50 text-sm font-medium">Add new account</p>
              <p className="text-white/20 text-xs mt-1">Bank account, credit/debit card, cash</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
