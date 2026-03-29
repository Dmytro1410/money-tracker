import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import type { Profile } from '@/types';

import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Budgets from '@/pages/Budgets';
import Analytics from '@/pages/Analytics';
import Accounts from '@/pages/Accounts';
import Login from '@/pages/Login';
import Categories from '@/pages/Categories';

export default function App() {
  const { profile, setProfile } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let done = false;

    function finish() {
      if (!done) {
        done = true;
        setInitializing(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          setProfile(null);
          finish();
          return;
        }
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          await loadProfile(session.user.id, session.user.email ?? '');
          finish();
        }
      },
    );

    const timeout = setTimeout(() => {
      console.warn('auth timeout');
      finish();
    }, 6000);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadProfile(userId: string, email: string) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) {
        setProfile(data as Profile);
        return;
      }
      const { data: created } = await supabase.from('profiles').upsert({ id: userId, email }).select().maybeSingle();
      setProfile((created ?? {
        id: userId,
        email,
        currency: 'CAD',
        locale: 'en-CA',
        created_at: new Date().toISOString(),
      }) as Profile);
    } catch {
      setProfile({
        id: userId, email, currency: 'CAD', locale: 'en-CA', created_at: new Date().toISOString(),
      } as Profile);
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-lime flex items-center justify-center mx-auto">
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
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route element={<Dashboard />} path="dashboard" />
        <Route element={<Transactions />} path="transactions" />
        <Route element={<Budgets />} path="budgets" />
        <Route element={<Analytics />} path="analytics" />
        <Route element={<Accounts />} path="accounts" />
        <Route element={<Categories />} path="categories" />
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}
