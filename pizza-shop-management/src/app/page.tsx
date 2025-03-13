import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-500 to-orange-600 p-4 text-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-6xl font-bold tracking-tight">Pizza Shop Management System</h1>
        <p className="mb-8 text-xl">
          A comprehensive solution for pizza restaurant operations
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link
            href="/dashboard/admin"
            className="flex flex-col items-center rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <h2 className="mb-3 text-2xl font-semibold">Admin Dashboard</h2>
            <p>Manage menus, users, tables, and view reports</p>
          </Link>

          <Link
            href="/dashboard/kitchen"
            className="flex flex-col items-center rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <h2 className="mb-3 text-2xl font-semibold">Kitchen Display</h2>
            <p>View and manage incoming orders and preparation status</p>
          </Link>

          <Link
            href="/dashboard/server"
            className="flex flex-col items-center rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <h2 className="mb-3 text-2xl font-semibold">Server Dashboard</h2>
            <p>Manage tables, take orders, and process payments</p>
          </Link>

          <Link
            href="/customer"
            className="flex flex-col items-center rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <h2 className="mb-3 text-2xl font-semibold">Customer Ordering</h2>
            <p>Browse menu and place orders from tables</p>
          </Link>

          <Link
            href="/auth/signin"
            className="flex flex-col items-center rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <h2 className="mb-3 text-2xl font-semibold">Staff Login</h2>
            <p>Secure login for restaurant staff</p>
          </Link>
        </div>
      </div>
    </div>
  );
}