'use client';

import React, { ReactElement, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';

export default function DashboardPage(): ReactElement {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role) {
      switch (session.user.role) {
        case UserRole.ADMIN:
          router.push('/dashboard/admin');
          break;
        case UserRole.SERVER:
          router.push('/dashboard/server');
          break;
        case UserRole.KITCHEN:
          router.push('/dashboard/kitchen');
          break;
        default:
          // If role is not recognized, redirect to customer view
          router.push('/customer');
      }
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Redirecting to your dashboard...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you to the appropriate dashboard.</p>
      </div>
    </div>
  );
}