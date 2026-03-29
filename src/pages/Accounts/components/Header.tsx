import { formatCurrency } from '@/lib/formatters.ts';

export interface IAccountsHeaderProps {
  onShowAdd: () => void,
  totalBalance: number
}

export function Header({
  onShowAdd,
  totalBalance,
}: IAccountsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Счета</h1>
        <p className="text-sm text-white/30 mt-0.5">
          Итого:
          {' '}
          <span className="font-display font-semibold text-white">{formatCurrency(totalBalance)}</span>
        </p>
      </div>
      <button className="btn-primary" type="button" onClick={onShowAdd}>
        <svg
          fill="none"
          height="14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          width="14"
        >
          <line x1="12" x2="12" y1="5" y2="19" />
          <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
        Добавить счёт
      </button>
    </div>
  );
}
