'use client';

import { useState, useEffect } from 'react';
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
import { TableStatus, OrderStatus } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

type Table = {
  id: string;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  location: string;
};

type OrderItem = {
  id: string;
  name: string;
  size?: string;
  quantity: number;
  customizations: string[];
};

type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
};

export default function TableDetailsPage() {
  const params = useParams();
  const tableId = params.id as string;
  const [activeTab, setActiveTab] = useState('current');
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some demo data that would typically come from the API
        const demoTable: Table = {
          id: tableId,
          tableNumber: parseInt(tableId),
          capacity: 4,
          status: TableStatus.OCCUPIED,
          location: 'Window',
        };

        const demoCurrentOrder: Order = {
          id: '1',
          orderNumber: `ORD-${Date.now().toString().slice(-6)}-001`,
          items: [
            { id: '1', name: 'Pepperoni Pizza', size: 'Large', quantity: 1, customizations: ['Extra Cheese', 'Thin Crust'] },
            { id: '2', name: 'Garlic Breadsticks', quantity: 2, customizations: [] },
          ],
          status: OrderStatus.PREPARING,
          createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        };

        const demoOrderHistory: Order[] = [
          {
            id: '2',
            orderNumber: `ORD-${Date.now().toString().slice(-6)}-000`,
            items: [
              { id: '3', name: 'Margherita Pizza', size: 'Medium', quantity: 1, customizations: ['Gluten-Free Crust'] },
            ],
            status: OrderStatus.COMPLETED,
            createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          },
        ];

        setTableData(demoTable);
        setCurrentOrder(demoCurrentOrder);
        setOrderHistory(demoOrderHistory);
      } catch (error) {
        console.error('Error fetching table data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load table data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableData();
  }, [tableId, toast]);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'bg-green-100 text-green-800 border-green-300';
      case TableStatus.OCCUPIED:
        return 'bg-red-100 text-red-800 border-red-300';
      case TableStatus.RESERVED:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case TableStatus.CLEANING:
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

  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    // In a real implementation, this would update the order status via an API endpoint
    toast({
      title: 'Status Updated',
      description: `Order status updated to ${newStatus}`,
    });

    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        status: newStatus,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-24">
        <p>Loading table data...</p>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="flex justify-center items-center h-full py-24">
        <p>Table not found</p>
      </div>
    );
  }

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
              {tableData.status === TableStatus.OCCUPIED && currentOrder && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Seated: {getTimeAgo(currentOrder.createdAt)}
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
            <Link href={`/dashboard/server/orders/new?tableId=${tableData.id}`}>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="current">Current Order</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              {currentOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Order #{currentOrder.orderNumber}</span>
                    </div>
                    <Badge variant={currentOrder.status === OrderStatus.PREPARING ? 'default' : 'outline'}>
                      {currentOrder.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {currentOrder.items.map((item) => (
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
                    {currentOrder.status === OrderStatus.PLACED && (
                      <Button
                        variant="outline"
                        onClick={() => handleOrderStatusUpdate(currentOrder.id, OrderStatus.PREPARING)}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Mark as Preparing
                      </Button>
                    )}
                    {currentOrder.status === OrderStatus.PREPARING && (
                      <Button
                        variant="outline"
                        onClick={() => handleOrderStatusUpdate(currentOrder.id, OrderStatus.READY)}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Mark as Ready
                      </Button>
                    )}
                    {currentOrder.status === OrderStatus.READY && (
                      <Button
                        onClick={() => handleOrderStatusUpdate(currentOrder.id, OrderStatus.COMPLETED)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Order
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No current order</p>
                  <Link href={`/dashboard/server/orders/new?tableId=${tableData.id}`}>
                    <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Order
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Receipt className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Order #{order.orderNumber}</span>
                        </div>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {getTimeAgo(order.createdAt)}
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item) => (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No order history</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}