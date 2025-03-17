import Link from 'next/link';
import SignUpForm from '@/components/forms/sign-up-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Join our Pizza Shop Management System</p>
        </div>

        <SignUpForm />

        <div className="mt-6 flex justify-center">
          <Link href="/auth/signin">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft size={16} />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}