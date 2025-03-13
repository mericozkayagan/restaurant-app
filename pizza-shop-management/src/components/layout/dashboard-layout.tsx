'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import {
  LayoutGrid,
  PizzaIcon,
  Users,
  CreditCard,
  BarChart,
  Settings,
  ChefHat,
  Utensils,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isAdmin = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
  const isKitchen = userRole === UserRole.KITCHEN || isAdmin;
  const isServer = userRole === UserRole.SERVER || isAdmin;

  const navigation = [
    // Admin links
    ...(isAdmin ? [
      { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutGrid },
      { name: 'Menu Management', href: '/dashboard/admin/menu', icon: PizzaIcon },
      { name: 'Staff Management', href: '/dashboard/admin/staff', icon: Users },
      { name: 'Tables', href: '/dashboard/admin/tables', icon: Utensils },
      { name: 'Payments', href: '/dashboard/admin/payments', icon: CreditCard },
      { name: 'Reports', href: '/dashboard/admin/reports', icon: BarChart },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ] : []),

    // Kitchen links
    ...(isKitchen ? [
      { name: 'Kitchen Display', href: '/dashboard/kitchen', icon: ChefHat },
      { name: 'Inventory', href: '/dashboard/kitchen/inventory', icon: Menu },
    ] : []),

    // Server links
    ...(isServer ? [
      { name: 'Tables', href: '/dashboard/server', icon: Utensils },
      { name: 'Orders', href: '/dashboard/server/orders', icon: PizzaIcon },
      { name: 'Payments', href: '/dashboard/server/payments', icon: CreditCard },
    ] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          type="button"
          className="fixed left-4 top-4 z-50 rounded-md bg-orange-600 p-2 text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />

            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-orange-700 pt-5 pb-4">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-2xl font-bold text-white">Pizza Shop</h1>
              </div>

              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-orange-800 text-white'
                          : 'text-orange-100 hover:bg-orange-600',
                        'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                      )}
                    >
                      <item.icon
                        className={cn(
                          pathname === item.href
                            ? 'text-orange-100'
                            : 'text-orange-300 group-hover:text-orange-100',
                          'mr-4 h-6 w-6 flex-shrink-0'
                        )}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-orange-700">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-2xl font-bold text-white">Pizza Shop</h1>
              </div>

              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-orange-800 text-white'
                        : 'text-orange-100 hover:bg-orange-600',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? 'text-orange-100'
                          : 'text-orange-300 group-hover:text-orange-100',
                        'mr-3 h-6 w-6 flex-shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown would go here */}
              <div className="relative ml-3">
                <div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <span className="text-sm font-medium leading-none text-orange-800">
                      {session?.user?.name?.[0] || 'U'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}