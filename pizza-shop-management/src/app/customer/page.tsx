'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: 'Pizzas', displayOrder: 1 },
  { id: '2', name: 'Sides', displayOrder: 2 },
  { id: '3', name: 'Drinks', displayOrder: 3 },
  { id: '4', name: 'Desserts', displayOrder: 4 },
];

const mockMenuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: '/images/margherita.jpg',
    categoryId: '1',
    isVegetarian: true,
    isPizzaBase: true,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
    price: 14.99,
    image: '/images/pepperoni.jpg',
    categoryId: '1',
    isVegetarian: false,
    isPizzaBase: true,
  },
  {
    id: '3',
    name: 'BBQ Chicken Pizza',
    description: 'Pizza with BBQ sauce, chicken, red onions, and cilantro',
    price: 15.99,
    image: '/images/bbq-chicken.jpg',
    categoryId: '1',
    isVegetarian: false,
    isPizzaBase: true,
  },
  {
    id: '4',
    name: 'Garlic Breadsticks',
    description: 'Freshly baked breadsticks with garlic butter and herbs',
    price: 5.99,
    image: '/images/breadsticks.jpg',
    categoryId: '2',
    isVegetarian: true,
    isPizzaBase: false,
  },
  {
    id: '5',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan cheese, and Caesar dressing',
    price: 7.99,
    image: '/images/caesar-salad.jpg',
    categoryId: '2',
    isVegetarian: true,
    isPizzaBase: false,
  },
  {
    id: '6',
    name: 'Coca-Cola',
    description: '20oz bottle',
    price: 2.49,
    image: '/images/coke.jpg',
    categoryId: '3',
    isVegetarian: true,
    isPizzaBase: false,
  },
  {
    id: '7',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center',
    price: 6.99,
    image: '/images/lava-cake.jpg',
    categoryId: '4',
    isVegetarian: true,
    isPizzaBase: false,
  },
];

type CartItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
};

export default function CustomerOrderingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState(5); // Mock table number

  const addToCart = (menuItem: any) => {
    const existingItemIndex = cart.findIndex(
      (item) => item.menuItemId === menuItem.id
    );

    if (existingItemIndex !== -1) {
      // Item already in cart, increase quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          id: `${menuItem.id}-${Date.now()}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    const existingItemIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingItemIndex].quantity > 1) {
        // Decrease quantity
        updatedCart[existingItemIndex].quantity -= 1;
      } else {
        // Remove item from cart
        updatedCart.splice(existingItemIndex, 1);
      }
      setCart(updatedCart);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.0825; // 8.25% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="bg-orange-600 p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pizza Shop</h1>
            <p className="text-sm">Table #{tableNumber}</p>
          </div>
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white p-0 text-xs font-bold text-orange-600">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col md:flex-row">
        <div className="flex-1 p-4">
          <Tabs defaultValue={mockCategories[0].id} className="w-full">
            <TabsList className="mb-4 flex w-full justify-start space-x-2 overflow-x-auto">
              {mockCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {mockCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mockMenuItems
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="relative h-48 w-full">
                          <div className="absolute inset-0 bg-gray-200" />
                          {/* Placeholder for image */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                            {item.name} Image
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{item.name}</CardTitle>
                            {item.isVegetarian && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Vegetarian
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between">
                          <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
                          <Button onClick={() => addToCart(item)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Order
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="w-full border-t border-gray-200 bg-white p-4 md:w-96 md:border-l md:border-t-0">
          <div className="sticky top-4">
            <h2 className="mb-4 text-xl font-bold">Your Order</h2>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Your cart is empty. Add some delicious items!
              </div>
            ) : (
              <>
                <div className="mb-4 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="mr-2 font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500">x{item.quantity}</span>
                        </div>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            {item.customizations.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-4 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => addToCart({ id: item.menuItemId, name: item.name, price: item.price })}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button className="mt-6 w-full" size="lg">
                  Place Order
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}