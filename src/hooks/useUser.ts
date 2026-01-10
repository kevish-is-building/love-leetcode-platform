'use client';

import { useAuthStore } from '@/store/useAuthStore';

/**
 * Convenience hook to access current user data
 */
export function useUser() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated,
  };
}
