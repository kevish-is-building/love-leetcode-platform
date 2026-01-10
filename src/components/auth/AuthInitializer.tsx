'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';

/**
 * Component to initialize auth state on app load
 * This checks if the user is authenticated by fetching their profile
 */
export function AuthInitializer() {
  const { isAuthenticated, getProfile } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    // Only fetch profile if not already authenticated and not on auth page
    if (!isAuthenticated && pathname !== '/auth') {
      getProfile();
    }
  }, []); // Only run on mount

  return null; // This component doesn't render anything
}
