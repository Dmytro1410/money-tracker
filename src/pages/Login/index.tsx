import { ChangeEvent, useState } from 'react';
import type { AuthMode } from '@/types/common.ts';
import { useFetchProfile, useLogin } from '@/hooks/Authentication.ts';
import { LoginComponent } from '@/pages/Login/component.tsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');

  const {
    error: profileError, isPending: isProfilePending, mutate: profileMutate,
  } = useFetchProfile();

  const {
    error: loginError, isPending: isLoginPending, mutate: loginMutate,
  } = useLogin((userId) => {
    profileMutate({ userId });
  });

  const handleOnEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOnPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleOnChangeMode = () => {
    setMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  };

  const handleLogin = () => {
    loginMutate({ email, password });
  };

  const handleRegister = () => {
  };

  const handleOnSubmit = () => {
    if (mode === 'login') handleLogin();

    else handleRegister();
  };

  return (
    <LoginComponent
      email={email}
      error={(loginError || profileError)?.message || ''}
      isLoading={isLoginPending || isProfilePending}
      mode={mode}
      password={password}
      onChangeEmail={handleOnEmailChange}
      onChangeMode={handleOnChangeMode}
      onChangePassword={handleOnPasswordChange}
      onSubmit={handleOnSubmit}
    />
  );
}
