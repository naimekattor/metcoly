// app/[locale]/dashboard/user/logout/page.tsx
// app/[locale]/dashboard/admin/logout/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear auth cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Redirect to home
    router.push('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging out...</p>
    </div>
  );
}