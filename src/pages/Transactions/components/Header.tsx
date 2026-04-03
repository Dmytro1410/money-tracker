import { DatePicker } from '@/components/DatePicker';
import { ITransactionsPageHeaderProps } from '@/models/Transactions.ts';

export function Header({ onShowTxModal }: ITransactionsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between h-10">
      <h1 className="header-main">Transactions</h1>
      <div className="flex items-center gap-8">
        <div className="hidden xl:block"><DatePicker /></div>
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            onShowTxModal();
          }}
        >
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
          Add
        </button>
      </div>
    </div>
  );
}
