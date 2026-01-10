'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';

/**
 * Hook to initialize auth state on app load
 * This checks if the user is authenticated by fetching their profile
 */
export function useAuthInit() {
  const { isAuthenticated, getProfile } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    // Only fetch profile if not already authenticated and not on auth page
    if (!isAuthenticated && pathname !== '/auth') {
      getProfile();
    }
  }, [isAuthenticated, getProfile, pathname]);
}
