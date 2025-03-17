'use client';

import { useState } from 'react';
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
  Receipt
} from 'lucide-react';

// Mock data for demonstration
const mockMenuItems = [
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
];

export default function NewOrderPage() {
  const [selectedTable, setSelectedTable] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = (item: any) => {
    const newItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      category: item.category,
      size: item.sizes ? item.sizes[0] : null,
      price: item.sizes ? item.sizes[0].price : item.price,
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

  const handleUpdateSize = (itemId: string, size: any) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId
          ? { ...item, size, price: size.price }
          : item
      )
    );
  };

  const handleToggleCustomization = (itemId: string, customization: any) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              customizations: item.customizations.some((c: any) => c.id === customization.id)
                ? item.customizations.filter((c: any) => c.id !== customization.id)
                : [...item.customizations, customization],
              price:
                item.price +
                (item.customizations.some((c: any) => c.id === customization.id)
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
                {mockMenuItems
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Table {num}
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
                          ${item.price.toFixed(2)}
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

                    {item.sizes && (
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select
                          value={item.size.id}
                          onValueChange={(value) =>
                            handleUpdateSize(
                              item.id,
                              item.sizes.find((s: any) => s.id === value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {item.sizes.map((size: any) => (
                              <SelectItem key={size.id} value={size.id}>
                                {size.name} - ${size.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {item.customizations && item.customizations.length > 0 && (
                      <div className="space-y-2">
                        <Label>Customizations</Label>
                        <div className="space-y-2">
                          {item.customizations.map((customization: any) => (
                            <div
                              key={customization.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={customization.id}
                                checked={item.customizations.some(
                                  (c: any) => c.id === customization.id
                                )}
                                onCheckedChange={() =>
                                  handleToggleCustomization(item.id, customization)
                                }
                              />
                              <Label htmlFor={customization.id}>
                                {customization.name}
                                {customization.price > 0 &&
                                  ` (+$${customization.price.toFixed(2)})`}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label>Quantity</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {orderItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No items in the order yet
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button
                  disabled={!selectedTable || orderItems.length === 0}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}