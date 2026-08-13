'use client';

import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export function ProtectedRoute({ children }: {
  children: (user: {
    id: string;
    email?: string;
  }) => React.ReactNode;
}) {
  const [user, setUser] = useState<{
    id: string;
    email?: string;
  } | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user)
        window.location.replace('/login');
      else
        setUser({ id: data.user.id, email: data.user.email });
      setChecking(false);
    });
  }, []);
  if (checking || !user)
    return <div className="grid min-h-screen place-items-center bg-[#f8f9fd]"><div className="size-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" /></div>;
  return <>{children(user)}</>;
}
