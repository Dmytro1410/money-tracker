import { getFormattedInputNumber, parseOnChangeInputNumber } from '@/lib/formatters.ts';
import { useAuthStore } from '@/stores';
import { useFetchAccounts } from '@/hooks/Accounts.ts';

export interface IMoneyInputProps {
  accountId?: string;
  amount: string;
  label: string;
  onSetAmount: (amount: string) => void;
}

export function MoneyInput({
  accountId, amount, label, onSetAmount,
}: IMoneyInputProps) {
  const { data: accounts = [] } = useFetchAccounts();
  const profile = useAuthStore((s) => s.profile);

  const currency = accounts.find((a) => a.id === accountId)?.currency ?? profile?.currency ?? 'CAD';
  return (
    <div>
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
        {label}
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
