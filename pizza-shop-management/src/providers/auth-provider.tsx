'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Add debug logging to monitor session initialization
  useEffect(() => {
    console.log('AuthProvider mounted');
  }, []);

  return (
    <SessionProvider
      refetchInterval={60} // More frequent updates (every minute)
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}