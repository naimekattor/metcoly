'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Attempt to fetch user session on initial load.
    // If the backend has an HTTP-only cookie session, this will succeed
    // and populate the user state.
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      {/* 
        Optional: We could return a loading spinner here while isLoading is true,
        but it's usually better to let the components handle their own loading state
        so the app doesn't block entirely on initial load unless required.
      */}
      {children}
    </>
  );
}
