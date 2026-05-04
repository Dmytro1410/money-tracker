import { ChangeEvent } from 'react';

export interface ILoginComponentProps {
  email: string,
  error: string | null,
  isLoading: boolean,
  mode: 'login' | 'register',
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void,
  onChangeMode: () => void,
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void,
  password: string,
}

export function LoginComponent({
  email,
  error,
  isLoading,
  mode,
  onChangeEmail,
  onChangeMode,
  onChangePassword,
  onSubmit,
  password,
}: ILoginComponentProps) {
  const getSubmitButtonText = () => {
    if (isLoading) return 'Loading...';
    return mode === 'login' ? 'Sign In' : 'Sign Up';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-night-900 px-4">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c6dfa, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
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
            <p className="text-xs text-white/30 mt-0.5">Personal finance</p>
          </div>
        </div>

        <div className="card-dark p-6 space-y-5">
          <div>
            <h1 className="font-display text-xl font-semibold text-white">
              {mode === 'login' ? 'Login' : 'Create account'}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {mode === 'login' ? 'Enter you email and password' : 'Create new account'}
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
                onChange={onChangeEmail}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Password</label>
              <input
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="input"
                placeholder="password"
                type="password"
                value={password}
                onChange={onChangePassword}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 bg-rose-400/10 rounded-xl px-3 py-2.5">{error}</p>}

          <button
            className="btn-primary w-full"
            disabled={isLoading || !email || !password}
            type="submit"
            onClick={onSubmit}
          >
            {getSubmitButtonText()}
          </button>

          <p className="text-center text-xs text-white/30">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <br />
            <button
              className="text-violet-400 hover:text-violet-300 transition-colors"
              type="button"
              onClick={onChangeMode}
            >
              {mode === 'login' ? 'Create account' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
