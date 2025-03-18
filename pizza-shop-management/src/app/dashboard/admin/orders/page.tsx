'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Edit, ChevronLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { OrderStatus, OrderType } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type Order = {
  id: string;
  orderNumber: string;
  tableId: string | null;
  orderType: OrderType;
  status: OrderStatus;
  specialInstructions: string | null;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
  table?: {
    tableNumber: number;
  } | null;
  createdBy: {
    name: string;
  };
};

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [activeType, setActiveType] = useState<OrderType | 'ALL'>('ALL');
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some realistic demo data
        const demoOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-5123',
            tableId: '2',
            orderType: OrderType.DINE_IN,
            status: OrderStatus.PLACED,
            specialInstructions: 'Extra napkins please',
            subtotal: 27.50,
            tax: 2.75,
            tip: 5.00,
            total: 35.25,
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
            table: {
              tableNumber: 5
            },
            createdBy: {
              name: 'Jane Smith'
            }
          },
          {
            id: '2',
            orderNumber: 'ORD-5124',
            tableId: '3',
            orderType: OrderType.DINE_IN,
            status: OrderStatus.PREPARING,
            specialInstructions: null,
            subtotal: 45.00,
            tax: 4.50,
            tip: 9.00,
            total: 58.50,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
            table: {
              tableNumber: 3
            },
            createdBy: {
              name: 'Jane Smith'
            }
          },
          {
            id: '3',
            orderNumber: 'ORD-5125',
            tableId: null,
            orderType: OrderType.TAKEOUT,
            status: OrderStatus.READY,
            specialInstructions: 'Ring bell when ready for pickup',
            subtotal: 22.75,
            tax: 2.28,
            tip: 0,
            total: 25.03,
            createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(), // 50 mins ago
            createdBy: {
              name: 'Mike Johnson'
            }
          },
          {
            id: '4',
            orderNumber: 'ORD-5126',
            tableId: null,
            orderType: OrderType.DELIVERY,
            status: OrderStatus.DELIVERING,
            specialInstructions: 'Leave at door',
            subtotal: 33.45,
            tax: 3.35,
            tip: 6.69,
            total: 43.49,
            createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 75 mins ago
            createdBy: {
              name: 'Mike Johnson'
            }
          },
          {
            id: '5',
            orderNumber: 'ORD-5120',
            tableId: '1',
            orderType: OrderType.DINE_IN,
            status: OrderStatus.COMPLETED,
            specialInstructions: null,
            subtotal: 78.50,
            tax: 7.85,
            tip: 15.70,
            total: 102.05,
            createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
            table: {
              tableNumber: 1
            },
            createdBy: {
              name: 'Jane Smith'
            }
          },
        ];

        setOrders(demoOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const filteredOrders = orders
    .filter(order => activeStatus === 'ALL' || order.status === activeStatus)
    .filter(order => activeType === 'ALL' || order.orderType === activeType);

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PREPARING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.DELIVERING:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeBadge = (type: OrderType) => {
    switch (type) {
      case OrderType.DINE_IN:
        return 'bg-green-100 text-green-800';
      case OrderType.TAKEOUT:
        return 'bg-orange-100 text-orange-800';
      case OrderType.DELIVERY:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Card className="flex-1">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Filter by Status</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Select
              value={activeStatus}
              onValueChange={(value) => setActiveStatus(value as OrderStatus | 'ALL')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={OrderStatus.PLACED}>Placed</SelectItem>
                <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
                <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
                <SelectItem value={OrderStatus.DELIVERING}>Delivering</SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Filter by Type</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Select
              value={activeType}
              onValueChange={(value) => setActiveType(value as OrderType | 'ALL')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value={OrderType.DINE_IN}>Dine In</SelectItem>
                <SelectItem value={OrderType.TAKEOUT}>Takeout</SelectItem>
                <SelectItem value={OrderType.DELIVERY}>Delivery</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Search</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Input placeholder="Search by order #" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Badge className={getOrderTypeBadge(order.orderType)}>
                        {order.orderType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.table ? `Table ${order.table.tableNumber}` : 'N/A'}
                    </TableCell>
                    <TableCell>{order.createdBy.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}