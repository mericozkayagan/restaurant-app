import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ChefHat, User, ArrowLeft, Utensils, Users, DollarSign, ClipboardList, BarChart2 } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your pizza shop operations from one central place.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={16} />
              Home
            </Button>
          </Link>
          <Link href="/dashboard/kitchen">
            <Button variant="outline" className="flex items-center gap-2">
              <ChefHat size={16} />
              Kitchen
            </Button>
          </Link>
          <Link href="/dashboard/server">
            <Button variant="outline" className="flex items-center gap-2">
              <User size={16} />
              Server
            </Button>
          </Link>
          <Link href="/customer">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Customer View
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/admin/menu" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Utensils className="h-8 w-8 text-orange-500" />
              <h2 className="text-xl font-semibold">Menu Items</h2>
            </div>
            <p className="mt-2 text-gray-600">Manage your pizza menu and other food items</p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/staff" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-8 w-8 text-blue-500" />
              <h2 className="text-xl font-semibold">Staff</h2>
            </div>
            <p className="mt-2 text-gray-600">Manage employees and their roles</p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/tables" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Utensils className="h-8 w-8 text-green-500" />
              <h2 className="text-xl font-semibold">Tables</h2>
            </div>
            <p className="mt-2 text-gray-600">Manage restaurant tables and seating</p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/orders" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <ClipboardList className="h-8 w-8 text-purple-500" />
              <h2 className="text-xl font-semibold">Orders</h2>
            </div>
            <p className="mt-2 text-gray-600">View and manage customer orders</p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/payments" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <h2 className="text-xl font-semibold">Payments</h2>
            </div>
            <p className="mt-2 text-gray-600">Track payments and transactions</p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/reports" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="h-8 w-8 text-red-500" />
              <h2 className="text-xl font-semibold">Reports</h2>
            </div>
            <p className="mt-2 text-gray-600">View sales and performance reports</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}