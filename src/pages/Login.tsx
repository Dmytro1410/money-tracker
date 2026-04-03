import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthMode } from '@/models/common.ts';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Аккаунт создан! Проверьте почту или войдите сразу.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-night-900 px-4">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c6dfa, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c6dfa,#c084fc)' }}
          >
            <svg
              fill="none"
              height="18"
              stroke="white"
              strokeLinecap="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="font-display font-semibold text-white text-lg leading-none">Budget</p>
            <p className="text-xs text-white/30 mt-0.5">Личные финансы</p>
          </div>
        </div>

        <div className="card-dark p-6 space-y-5">
          <div>
            <h1 className="font-display text-xl font-semibold text-white">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {mode === 'login' ? 'Введите данные для входа' : 'Создайте новый аккаунт'}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Email</label>
              <input
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Пароль</label>
              <input
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="input"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 bg-rose-400/10 rounded-xl px-3 py-2.5">{error}</p>}
          {message && <p className="text-xs text-emerald-400 bg-emerald-400/10 rounded-xl px-3 py-2.5">{message}</p>}

          <button className="btn-primary w-full" disabled={loading || !email || !password} onClick={handleSubmit}>
            {loading ? 'Загрузка…' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          <p className="text-center text-xs text-white/30">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            {' '}
            <button
              className="text-violet-400 hover:text-violet-300 transition-colors"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
