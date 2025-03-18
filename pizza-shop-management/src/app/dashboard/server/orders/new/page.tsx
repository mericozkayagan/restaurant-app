'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  ShoppingCart,
  Receipt,
  MinusCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { OrderType } from '@prisma/client';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  sizes?: Size[];
  price?: number;
  customizations: Customization[];
};

type Size = {
  id: string;
  name: string;
  price: number;
};

type Customization = {
  id: string;
  name: string;
  price: number;
};

type Table = {
  id: string;
  tableNumber: number;
};

type OrderItem = {
  id: string;
  name: string;
  category: string;
  size: Size | null;
  price: number;
  quantity: number;
  customizations: Customization[];
};

export default function NewOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedTableId = searchParams.get('tableId');

  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState(preselectedTableId || '');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some demo data that would typically come from the API
        const demoTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
          id: (i + 1).toString(),
          tableNumber: i + 1
        }));

        const demoMenuItems: MenuItem[] = [
          {
            id: '1',
            name: 'Pepperoni Pizza',
            category: 'Pizzas',
            sizes: [
              { id: 'small', name: 'Small', price: 12.99 },
              { id: 'medium', name: 'Medium', price: 15.99 },
              { id: 'large', name: 'Large', price: 18.99 },
            ],
            customizations: [
              { id: 'extra-cheese', name: 'Extra Cheese', price: 1.99 },
              { id: 'thin-crust', name: 'Thin Crust', price: 0 },
              { id: 'thick-crust', name: 'Thick Crust', price: 0 },
            ],
          },
          {
            id: '2',
            name: 'Garlic Breadsticks',
            category: 'Sides',
            price: 5.99,
            customizations: [
              { id: 'extra-garlic', name: 'Extra Garlic', price: 0.99 },
              { id: 'parmesan', name: 'Parmesan', price: 0.99 },
            ],
          },
          {
            id: '3',
            name: 'Margherita Pizza',
            category: 'Pizzas',
            sizes: [
              { id: 'small', name: 'Small', price: 10.99 },
              { id: 'medium', name: 'Medium', price: 13.99 },
              { id: 'large', name: 'Large', price: 16.99 },
            ],
            customizations: [
              { id: 'extra-basil', name: 'Extra Basil', price: 0.99 },
              { id: 'buffalo-mozzarella', name: 'Buffalo Mozzarella', price: 2.99 },
            ],
          },
          {
            id: '4',
            name: 'Caesar Salad',
            category: 'Sides',
            price: 7.99,
            customizations: [
              { id: 'no-croutons', name: 'No Croutons', price: 0 },
              { id: 'extra-dressing', name: 'Extra Dressing', price: 0.99 },
            ],
          },
        ];

        setTables(demoTables);
        setMenuItems(demoMenuItems);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddItem = (item: MenuItem) => {
    const newItem: OrderItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      category: item.category,
      size: item.sizes ? item.sizes[0] : null,
      price: item.sizes ? item.sizes[0].price : (item.price || 0),
      quantity: 1,
      customizations: [],
    };
    setOrderItems([...orderItems, newItem]);
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateSize = (itemId: string, size: Size) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId
          ? { ...item, size, price: size.price }
          : item
      )
    );
  };

  const handleToggleCustomization = (itemId: string, customization: Customization) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              customizations: item.customizations.some((c) => c.id === customization.id)
                ? item.customizations.filter((c) => c.id !== customization.id)
                : [...item.customizations, customization],
              price:
                item.price +
                (item.customizations.some((c) => c.id === customization.id)
                  ? -customization.price
                  : customization.price),
            }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (!selectedTable) {
      toast({
        title: 'Select a Table',
        description: 'Please select a table for this order.',
        variant: 'destructive',
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: 'No Items Added',
        description: 'Please add at least one item to the order.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // In a real implementation, this would connect to an API endpoint to create the order
      // For now, we'll just show a toast message and redirect
      toast({
        title: 'Order Created',
        description: 'Your order has been created successfully.',
      });

      // Redirect back to the table detail page
      router.push(`/dashboard/server/tables/${selectedTable}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-24">
        <p>Loading menu data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={selectedTable ? `/dashboard/server/tables/${selectedTable}` : '/dashboard/server'}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {selectedTable ? 'Back to Table' : 'Back to Tables'}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
            <p className="text-muted-foreground">
              Create a new order for a table
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Menu Section */}
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <ShoppingCart className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="space-y-4">
                {menuItems
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.category}
                        </p>
                        <p className="text-sm">
                          {item.sizes
                            ? `${item.sizes[0].name}: $${item.sizes[0].price.toFixed(2)}`
                            : `$${(item.price || 0).toFixed(2)}`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddItem(item)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Order</CardTitle>
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <span className="text-xl font-bold">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Table Number</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        Table {table.tableNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} {item.size ? `- ${item.size.name}` : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Size Selection */}
                    {item.size && (
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select
                          value={item.size.id}
                          onValueChange={(value) => {
                            const menuItem = menuItems.find(m => m.name === item.name);
                            const size = menuItem?.sizes?.find(s => s.id === value);
                            if (size) {
                              handleUpdateSize(item.id, size);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {menuItems
                              .find(m => m.name === item.name)
                              ?.sizes?.map((size) => (
                                <SelectItem key={size.id} value={size.id}>
                                  {size.name} (${size.price.toFixed(2)})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Customizations */}
                    <div className="space-y-2">
                      <Label>Customizations</Label>
                      <div className="space-y-2">
                        {menuItems
                          .find(m => m.name === item.name)
                          ?.customizations.map((customization) => (
                            <div
                              key={customization.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`${item.id}-${customization.id}`}
                                checked={item.customizations.some(c => c.id === customization.id)}
                                onCheckedChange={() =>
                                  handleToggleCustomization(item.id, customization)
                                }
                              />
                              <Label htmlFor={`${item.id}-${customization.id}`}>
                                {customization.name}
                                {customization.price > 0 && ` (+$${customization.price.toFixed(2)})`}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center justify-between">
                      <Label>Quantity</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">Item Total:</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {orderItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No items added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Search and add items from the menu on the left
                    </p>
                  </div>
                )}
              </div>

              {orderItems.length > 0 && (
                <>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Order Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
                    onClick={handleCreateOrder}
                  >
                    Create Order
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}