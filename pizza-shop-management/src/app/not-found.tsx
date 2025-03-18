import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-red-600 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors duration-200"
          >
            Go Home
          </Link>
          <Link
            href="/customer"
            className="inline-block px-6 py-2 bg-white text-gray-700 font-medium rounded-md shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Menu
          </Link>
        </div>
      </div>
    </div>
  );
} 