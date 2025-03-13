import Link from 'next/link';
import SignInForm from '@/components/forms/sign-in-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">Access your Pizza Shop Management account</p>
        </div>

        <SignInForm />

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="text-orange-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}