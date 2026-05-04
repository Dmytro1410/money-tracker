import { useMutation } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/api';
import { useAuthStore } from '@/stores';

export interface IAuthResponse {
  user: { id: string },
  session: { accessToken: string, refreshToken: string }
}

export function useLogin(onSuccess?: (userId: string) => void) {
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      if (!body.email || !body.password) throw new Error('Invalid credentials');

      const { data, error } = await apiPost({ url: '/auth/login', body });

      if (error) throw error;

      return data as IAuthResponse;
    },
    onSuccess: (data: IAuthResponse) => {
      const { session: { accessToken, refreshToken }, user: { id } } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', id);
      onSuccess?.(id);
    },
  });
}

export function useLogout() {
  const { setProfile } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const { error } = await apiGet({ url: '/auth/logout' });

      if (error) throw error;
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      setProfile(null);
    },
  });
}

export interface IProfileResponse {
  avatarUrl: string | null;
  createdAt: string,
  currency: string,
  email: string,
  fullName: string | null,
  id: string,
  locale: string,
}

export function useFetchProfile() {
  const { setProfile } = useAuthStore();
  return useMutation({
    mutationFn: async (body: { userId: string }) => {
      if (!body.userId) throw new Error('Please provide a user ID');

      const { data, error } = await apiPost({ url: '/profile', body });

      if (error) throw error;

      return data as IProfileResponse;
    },
    onSuccess: (data: IProfileResponse) => {
      setProfile(data);
    },
  });
}
