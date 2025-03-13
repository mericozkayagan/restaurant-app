import { Card } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your pizza shop operations from one central place.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <p className="mt-2 text-gray-600">Manage your pizza menu and other food items</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Staff</h2>
          <p className="mt-2 text-gray-600">Manage employees and their roles</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Tables</h2>
          <p className="mt-2 text-gray-600">Manage restaurant tables and seating</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="mt-2 text-gray-600">View and manage customer orders</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Payments</h2>
          <p className="mt-2 text-gray-600">Track payments and transactions</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Reports</h2>
          <p className="mt-2 text-gray-600">View sales and performance reports</p>
        </Card>
      </div>
    </div>
  );
}