'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  notes: string | null;
  customizations: string[];
};

type Order = {
  id: string;
  orderNumber: number;
  tableNumber: number | null;
  customerName: string | null;
  items: OrderItem[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
  isDelivery: boolean;
  isPickup: boolean;
  createdAt: Date;
  estimatedCompletionTime: Date | null;
};

export default function KitchenOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some demo data that would typically come from the API
        const now = new Date();

        // Helper to generate random orders
        const generateOrders = (count: number): Order[] => {
          return Array.from({ length: count }, (_, i) => {
            const orderNumber = 1000 + i;
            const isDelivery = Math.random() > 0.7;
            const isPickup = !isDelivery && Math.random() > 0.5;
            const tableNumber = (!isDelivery && !isPickup) ? Math.floor(Math.random() * 12) + 1 : null;

            // Generate order status based on which tab is active
            let status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';

            // Make most orders pending, some preparing, few ready
            const rand = Math.random();
            if (rand < 0.6) {
              status = 'PENDING';
            } else if (rand < 0.9) {
              status = 'PREPARING';
            } else {
              status = 'READY';
            }

            // For orders that are not PENDING, set an estimated completion time
            const estimatedCompletionTime = status !== 'PENDING'
              ? new Date(now.getTime() + Math.floor(Math.random() * 20 + 10) * 60000)
              : null;

            // Create date slightly in the past
            const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 30) * 60000);

            // Generate between 1 and 5 items for this order
            const itemCount = Math.floor(Math.random() * 5) + 1;
            const items: OrderItem[] = Array.from({ length: itemCount }, (_, j) => {
              const menuItems = [
                'Pepperoni Pizza', 'Margherita Pizza', 'Supreme Pizza', 'Meat Lovers Pizza',
                'Vegetarian Pizza', 'Buffalo Wings', 'Garlic Knots', 'Caesar Salad',
                'Chicken Parmesan', 'Spaghetti Carbonara', 'Lasagna', 'Tiramisu'
              ];

              const customizationOptions = [
                'Extra Cheese', 'No Onions', 'Well Done', 'Thin Crust',
                'Light Sauce', 'Extra Sauce', 'Add Bacon', 'Gluten-Free'
              ];

              // Randomly select 0-3 customizations
              const customCount = Math.floor(Math.random() * 3);
              const customizations = Array.from({ length: customCount }, () => {
                return customizationOptions[Math.floor(Math.random() * customizationOptions.length)];
              });

              return {
                id: `item-${j}-${Date.now()}`,
                name: menuItems[Math.floor(Math.random() * menuItems.length)],
                quantity: Math.floor(Math.random() * 3) + 1,
                notes: Math.random() > 0.7 ? 'Please make it extra hot' : null,
                customizations,
              };
            });

            return {
              id: `order-${orderNumber}`,
              orderNumber,
              tableNumber,
              customerName: isDelivery || isPickup ? 'John Doe' : null,
              items,
              status,
              isDelivery,
              isPickup,
              createdAt,
              estimatedCompletionTime,
            };
          });
        };

        // Generate 15 sample orders
        const demoOrders = generateOrders(15);

        setOrders(demoOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Filter orders when search query or active tab changes
  useEffect(() => {
    let filtered = orders;

    // First filter by tab selection
    switch (activeTab) {
      case 'pending':
        filtered = orders.filter(order => order.status === 'PENDING');
        break;
      case 'preparing':
        filtered = orders.filter(order => order.status === 'PREPARING');
        break;
      case 'ready':
        filtered = orders.filter(order => order.status === 'READY');
        break;
      default:
        filtered = orders;
        break;
    }

    // Then apply search query if present
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toString().includes(query) ||
        (order.tableNumber && order.tableNumber.toString().includes(query)) ||
        (order.customerName && order.customerName.toLowerCase().includes(query)) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, orders, activeTab]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              // Set estimated completion time if transitioning to PREPARING
              estimatedCompletionTime: newStatus === 'PREPARING' && !order.estimatedCompletionTime
                ? new Date(new Date().getTime() + 15 * 60000) // 15 minutes from now
                : order.estimatedCompletionTime
            }
          : order
      )
    );

    toast({
      title: 'Order Updated',
      description: `Order #${orders.find(o => o.id === orderId)?.orderNumber} marked as ${newStatus.toLowerCase()}.`,
    });
  };

  const getOrderTypeLabel = (order: Order) => {
    if (order.isDelivery) return 'Delivery';
    if (order.isPickup) return 'Pickup';
    return `Table ${order.tableNumber}`;
  };

  const getTimeSinceCreated = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    return `${diffMinutes} minutes ago`;
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'PREPARING':
        return 'bg-blue-500';
      case 'READY':
        return 'bg-green-500';
      case 'COMPLETED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-24">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kitchen Orders</h1>
          <p className="text-muted-foreground">
            View and manage all incoming orders
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {orders.filter(order => order.status === 'PENDING').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing
            <Badge variant="secondary" className="ml-2">
              {orders.filter(order => order.status === 'PREPARING').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready
            <Badge variant="secondary" className="ml-2">
              {orders.filter(order => order.status === 'READY').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>Order #{order.orderNumber}</CardTitle>
                      <Badge variant="outline">{getOrderTypeLabel(order)}</Badge>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getTimeSinceCreated(order.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.quantity}x </span>
                            <span>{item.name}</span>
                            {item.customizations.length > 0 && (
                              <div className="text-sm text-muted-foreground pl-6">
                                {item.customizations.join(', ')}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-sm text-orange-600 pl-6">
                                Note: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                      >
                        Start Preparing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No pending orders</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search query
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>Order #{order.orderNumber}</CardTitle>
                      <Badge variant="outline">{getOrderTypeLabel(order)}</Badge>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-muted-foreground">
                        {getTimeSinceCreated(order.createdAt)}
                      </div>
                      {order.estimatedCompletionTime && (
                        <div className="text-sm text-muted-foreground">
                          Est. completion: {format(order.estimatedCompletionTime, 'h:mm a')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.quantity}x </span>
                            <span>{item.name}</span>
                            {item.customizations.length > 0 && (
                              <div className="text-sm text-muted-foreground pl-6">
                                {item.customizations.join(', ')}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-sm text-orange-600 pl-6">
                                Note: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateOrderStatus(order.id, 'READY')}
                      >
                        Mark as Ready
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No orders being prepared</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search query
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>Order #{order.orderNumber}</CardTitle>
                      <Badge variant="outline">{getOrderTypeLabel(order)}</Badge>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getTimeSinceCreated(order.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.quantity}x </span>
                            <span>{item.name}</span>
                            {item.customizations.length > 0 && (
                              <div className="text-sm text-muted-foreground pl-6">
                                {item.customizations.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="default"
                        className="bg-gray-600 hover:bg-gray-700"
                        onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                      >
                        Mark as Delivered
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No orders ready for delivery</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search query
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}