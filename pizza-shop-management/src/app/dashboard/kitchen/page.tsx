'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, CheckCircle, Home, User, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-123456-001',
    tableNumber: 5,
    items: [
      { id: '1', name: 'Pepperoni Pizza', size: 'Large', quantity: 1, customizations: ['Extra Cheese', 'Thin Crust'] },
      { id: '2', name: 'Garlic Breadsticks', quantity: 2, customizations: [] },
    ],
    status: 'PLACED',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    orderNumber: 'ORD-123456-002',
    tableNumber: 8,
    items: [
      { id: '3', name: 'Margherita Pizza', size: 'Medium', quantity: 1, customizations: ['Gluten-Free Crust'] },
      { id: '4', name: 'Caesar Salad', quantity: 1, customizations: ['No Croutons'] },
    ],
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: '3',
    orderNumber: 'ORD-123456-003',
    tableNumber: 3,
    items: [
      { id: '5', name: 'BBQ Chicken Pizza', size: 'Large', quantity: 1, customizations: ['Extra BBQ Sauce'] },
      { id: '6', name: 'Buffalo Wings', quantity: 1, customizations: ['Extra Hot'] },
      { id: '7', name: 'Coca-Cola', quantity: 2, customizations: [] },
    ],
    status: 'READY',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
];

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("new");

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Update the active tab if there are no more orders in the current tab
    const remainingOrdersInCurrentTab = orders.filter(
      order => order.id !== orderId &&
      ((activeTab === "new" && order.status === "PLACED") ||
       (activeTab === "preparing" && order.status === "PREPARING") ||
       (activeTab === "ready" && order.status === "READY"))
    );

    if (remainingOrdersInCurrentTab.length === 0) {
      if (activeTab === "new") {
        setActiveTab("preparing");
      } else if (activeTab === "preparing") {
        setActiveTab("ready");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kitchen Dashboard</h1>
          <p className="text-muted-foreground">
            Manage orders and food preparation.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={16} />
              Home
            </Button>
          </Link>
          <Link href="/dashboard/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings size={16} />
              Admin
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

      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">
            New Orders
            <Badge variant="destructive" className="ml-2">
              {orders.filter((order) => order.status === 'PLACED').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing
            <Badge variant="default" className="ml-2">
              {orders.filter((order) => order.status === 'PREPARING').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready
            <Badge variant="outline" className="ml-2">
              {orders.filter((order) => order.status === 'READY').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {orders
              .filter((order) => order.status === 'PLACED')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  nextStatus="PREPARING"
                  actionLabel="Start Preparing"
                  actionIcon={<ChefHat className="mr-2 h-4 w-4" />}
                />
              ))}
            {orders.filter((order) => order.status === 'PLACED').length === 0 && (
              <div className="col-span-2 py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No new orders</h3>
                <p className="mt-2 text-sm text-gray-500">All current orders are being prepared or ready for pick-up</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preparing" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {orders
              .filter((order) => order.status === 'PREPARING')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  nextStatus="READY"
                  actionLabel="Mark as Ready"
                  actionIcon={<CheckCircle className="mr-2 h-4 w-4" />}
                />
              ))}
            {orders.filter((order) => order.status === 'PREPARING').length === 0 && (
              <div className="col-span-2 py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders in preparation</h3>
                <p className="mt-2 text-sm text-gray-500">Check the new orders tab for incoming orders</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ready" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {orders
              .filter((order) => order.status === 'READY')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  nextStatus="DELIVERED"
                  actionLabel="Mark as Delivered"
                  actionIcon={<CheckCircle className="mr-2 h-4 w-4" />}
                />
              ))}
            {orders.filter((order) => order.status === 'READY').length === 0 && (
              <div className="col-span-2 py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders ready for pickup</h3>
                <p className="mt-2 text-sm text-gray-500">All orders have been delivered or are still being prepared</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({ order, onUpdateStatus, nextStatus, actionLabel, actionIcon }: any) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 60;
    if (interval < 60) return `${Math.floor(interval)} minutes ago`;

    interval = seconds / 3600;
    return `${Math.floor(interval)} hours ago`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Order #{order.orderNumber}
        </CardTitle>
        <Badge variant={order.status === 'PLACED' ? 'destructive' : 'outline'}>
          Table {order.tableNumber}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {getTimeAgo(order.createdAt)}
          </div>

          <div className="mt-4 space-y-2">
            {order.items.map((item: any) => (
              <div key={item.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  {item.size && <span className="text-sm">{item.size}</span>}
                </div>
                {item.customizations.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.customizations.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            className="mt-4 flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            {actionIcon}
            {actionLabel}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}