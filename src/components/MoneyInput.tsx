import { getFormattedInputNumber, parseOnChangeInputNumber } from '@/lib/formatters.ts';
import { useAuthStore } from '@/stores';
import { useAccounts } from '@/hooks';

export interface IMoneyInputProps {
  accountId?: string;
  amount: string;
  onSetAmount: (amount: string) => void;
}

export function MoneyInput({
  accountId, amount, onSetAmount,
}: IMoneyInputProps) {
  const { data: accounts = [] } = useAccounts();
  const profile = useAuthStore((s) => s.profile);

  const currency = accounts.find((a) => a.id === accountId)?.currency ?? profile?.currency ?? 'CAD';
  return (
    <div>
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
        Limit for month
      </label>
      <div className="relative">
        <input
          autoFocus
          className="input text-xl font-800 pr-16"
          inputMode="decimal"
          placeholder="$0"
          type="text"
          value={getFormattedInputNumber(amount)}
          onChange={(e) => {
            parseOnChangeInputNumber(e, onSetAmount);
          }}
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/25 font-600">
          {currency}
        </span>
      </div>
    </div>
  );
}
