'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'Unable to sign in.',
  };

  const errorMessage = error && errorMessages[error] ? errorMessages[error] : errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Error</h1>
          <p className="mt-2 text-gray-600">{errorMessage}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/auth/signin">
            <Button>Back to Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}