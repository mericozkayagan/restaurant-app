import Link from 'next/link';
import { SignInForm } from '@/components/forms/sign-in-form';
import { Button } from '@/components/ui/button';
import { Home, ChevronLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <SignInForm />

        <div className="mt-6 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft size={16} />
                Back to Home
              </Button>
            </Link>
            <Link href="/customer">
              <Button variant="outline" className="flex items-center gap-2">
                Customer View
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}