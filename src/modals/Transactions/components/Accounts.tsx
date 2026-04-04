import Select from '@/components/ui/Select.tsx';
import { ITransactionFormAccountsProps } from '@/types/Transactions.ts';

export function Accounts({
  accountId, accounts, onSetAccountId, onSetToAccountId, toAccountId, type,
}: ITransactionFormAccountsProps) {
  return (
    <div className={`grid gap-3 ${type === 'transfer' ? 'grid-cols-2' : 'grid-cols-1'}`}>
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
          {type === 'transfer' ? 'From' : 'Account'}
        </label>
        <Select
          options={accounts.map((a) => ({ value: a.id, label: a.name }))}
          value={accountId}
          onChange={onSetAccountId}
        />
      </div>
      {type === 'transfer' && (
        <div>
          <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">To</label>
          <Select
            options={accounts
              .filter((a) => (a.id !== accountId))
              .map((a) => ({ value: a.id, label: a.name }))}
            value={toAccountId}
            onChange={onSetToAccountId}
          />

        </div>
      )}
    </div>
  );
}
