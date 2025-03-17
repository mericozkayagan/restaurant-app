'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Clock,
  Users,
  Utensils,
  PlusCircle,
  Receipt,
  ChefHat,
  CheckCircle
} from 'lucide-react';

// Mock data for demonstration
const mockTableData = {
  id: '1',
  tableNumber: 1,
  capacity: 2,
  status: 'OCCUPIED',
  location: 'Window',
  currentOrder: {
    id: 'ORD-123456-001',
    items: [
      { id: '1', name: 'Pepperoni Pizza', size: 'Large', quantity: 1, customizations: ['Extra Cheese', 'Thin Crust'] },
      { id: '2', name: 'Garlic Breadsticks', quantity: 2, customizations: [] },
    ],
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  orderHistory: [
    {
      id: 'ORD-123456-000',
      items: [
        { id: '3', name: 'Margherita Pizza', size: 'Medium', quantity: 1, customizations: ['Gluten-Free Crust'] },
      ],
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
  ],
};

export default function TableDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('current');
  const [tableData, setTableData] = useState(mockTableData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CLEANING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 60;
    if (interval < 60) return `${Math.floor(interval)} minutes ago`;

    interval = seconds / 3600;
    return `${Math.floor(interval)} hours ago`;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/server">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Tables
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Table {tableData.tableNumber}</h1>
            <p className="text-muted-foreground">
              Manage orders and customer service for this table
            </p>
          </div>
        </div>
      </div>

      {/* Table Information */}
      <Card>
        <CardHeader>
          <CardTitle>Table Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                Capacity: {tableData.capacity} people
              </div>
              <div className="flex items-center text-sm">
                <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                Location: {tableData.location}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Badge className={`${getStatusColor(tableData.status)} border px-2 py-1 text-xs font-semibold`}>
                  {tableData.status}
                </Badge>
              </div>
              {tableData.status === 'OCCUPIED' && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Seated: {getTimeAgo(tableData.currentOrder.createdAt)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Orders</CardTitle>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="current">Current Order</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              {tableData.currentOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Order #{tableData.currentOrder.id}</span>
                    </div>
                    <Badge variant={tableData.currentOrder.status === 'PREPARING' ? 'default' : 'outline'}>
                      {tableData.currentOrder.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {tableData.currentOrder.items.map((item: any) => (
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

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <ChefHat className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Order
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No current order</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-4">
                {tableData.orderHistory.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Order #{order.id}</span>
                      </div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {getTimeAgo(order.createdAt)}
                    </div>
                    <div className="space-y-2">
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
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}