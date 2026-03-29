export interface ITransactionsHeaderProps {
  onShowAdd: () => void
}

export function Header({ onShowAdd }: ITransactionsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="header-main">Transactions</h1>
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
        Добавить
      </button>
    </div>
  );
}
