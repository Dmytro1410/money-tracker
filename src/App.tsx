import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/stores';

import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import BudgetsPage from '@/pages/Budgets';
import Analytics from '@/pages/Analytics';
import Accounts from '@/pages/Accounts';
import Categories from '@/pages/Categories';
import Login from '@/pages/Login';
import { RouteNames } from '@/constants.ts';
import { useFetchProfile } from '@/hooks/Authentication.ts';

export default function App() {
  const { profile } = useAuthStore();
  const { isPending } = useFetchProfile();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-night-900 flex items-center justify-center mx-auto">
            <svg
              fill="none"
              height="22"
              stroke="#131313"
              strokeLinecap="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="22"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-white/30 text-sm font-500">Загрузка…</p>
        </div>
      </div>
    );
  }

  if (!profile) return <Login />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to={RouteNames.Dashboard} />} />
        <Route element={<Dashboard />} path={RouteNames.Dashboard} />
        <Route element={<Transactions />} path={RouteNames.Transactions} />
        <Route element={<BudgetsPage />} path={RouteNames.Budgets} />
        <Route element={<Analytics />} path={RouteNames.Analytics} />
        <Route element={<Accounts />} path={RouteNames.Accounts} />
        <Route element={<Categories />} path={RouteNames.Categories} />
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}
