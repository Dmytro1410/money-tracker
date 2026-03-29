import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const DashboardIcon = (
  <svg
    fill="none"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <rect height="7" rx="1.5" width="7" x="3" y="3" />
    <rect height="7" rx="1.5" width="7" x="14" y="3" />
    <rect height="7" rx="1.5" width="7" x="3" y="14" />
    <rect height="7" rx="1.5" width="7" x="14" y="14" />

  </svg>
);

const TransactionsIcon = (
  <svg
    fill="none"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const BudgetsIcon = (
  <svg
    fill="none"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AnalyticsIcon = (
  <svg
    fill="none"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const AccountsIcon = (
  <svg
    fill="none"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <rect height="14" rx="2" width="20" x="2" y="5" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const CategoriesIcon = (
  <svg
    fill="none"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const NAV = [
  {
    to: '/dashboard',
    label: 'Обзор',
    icon: DashboardIcon,
  },
  {
    to: '/transactions',
    label: 'Транзакции',
    icon: TransactionsIcon,
  },
  {
    to: '/budgets',
    label: 'Бюджеты',
    icon: BudgetsIcon,
  },
  {
    to: '/analytics',
    label: 'Аналитика',
    icon: AnalyticsIcon,
  },
  {
    to: '/accounts',
    label: 'Счета',
    icon: AccountsIcon,
  },
  {
    to: '/categories',
    label: 'Категории',
    icon: CategoriesIcon,
  },
];

export function Navigation() {
  return (
    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
      {NAV.map(({ icon, label, to }) => (
        <NavLink key={to} className={({ isActive }) => clsx('nav-item', isActive && 'active')} to={to}>
          <span className="flex-shrink-0">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
