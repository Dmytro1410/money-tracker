import { useAuthStore } from '@/stores';
import { ITransactionFormAmountProps } from '@/models/Transactions.ts';

export function Amount({
  accountId, accounts, amount, onSetAmount,
}: ITransactionFormAmountProps) {
  const profile = useAuthStore((s) => s.profile);
  return (
    <div>
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Amount</label>
      <div className="relative">
        <input
          autoFocus
          className="input text-xl font-800 pr-16"
          inputMode="decimal"
          min="0"
          placeholder="0"
          type="number"
          value={amount}
          onChange={(e) => onSetAmount(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/25 font-600">
          {accounts.find((a) => a.id === accountId)?.currency ?? profile?.currency ?? 'CAD'}
        </span>
      </div>
    </div>
  );
}
