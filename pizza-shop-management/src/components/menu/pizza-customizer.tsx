'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/utils';

// Mock data for demonstration
const pizzaSizes = [
  { id: '1', name: 'Small', diameter: 10, basePrice: 10.99 },
  { id: '2', name: 'Medium', diameter: 12, basePrice: 12.99 },
  { id: '3', name: 'Large', diameter: 14, basePrice: 14.99 },
  { id: '4', name: 'X-Large', diameter: 16, basePrice: 16.99 },
];

const pizzaCrusts = [
  { id: '1', name: 'Thin', priceAdjustment: 0 },
  { id: '2', name: 'Regular', priceAdjustment: 0 },
  { id: '3', name: 'Deep Dish', priceAdjustment: 2 },
  { id: '4', name: 'Gluten-Free', priceAdjustment: 3 },
];

const pizzaToppings = [
  { id: '1', name: 'Pepperoni', category: 'Meat', priceAdjustment: 1.5 },
  { id: '2', name: 'Sausage', category: 'Meat', priceAdjustment: 1.5 },
  { id: '3', name: 'Bacon', category: 'Meat', priceAdjustment: 1.5 },
  { id: '4', name: 'Ham', category: 'Meat', priceAdjustment: 1.5 },
  { id: '5', name: 'Chicken', category: 'Meat', priceAdjustment: 2 },
  { id: '6', name: 'Mushrooms', category: 'Vegetable', priceAdjustment: 1 },
  { id: '7', name: 'Onions', category: 'Vegetable', priceAdjustment: 1 },
  { id: '8', name: 'Bell Peppers', category: 'Vegetable', priceAdjustment: 1 },
  { id: '9', name: 'Black Olives', category: 'Vegetable', priceAdjustment: 1 },
  { id: '10', name: 'Tomatoes', category: 'Vegetable', priceAdjustment: 1 },
  { id: '11', name: 'Jalapeños', category: 'Vegetable', priceAdjustment: 1 },
  { id: '12', name: 'Pineapple', category: 'Fruit', priceAdjustment: 1 },
  { id: '13', name: 'Extra Cheese', category: 'Cheese', priceAdjustment: 1.5 },
  { id: '14', name: 'Feta Cheese', category: 'Cheese', priceAdjustment: 1.5 },
];

interface PizzaCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: any;
  onAddToCart: (customizedPizza: any) => void;
}

export default function PizzaCustomizer({
  isOpen,
  onClose,
  pizza,
  onAddToCart,
}: PizzaCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState(pizzaSizes[1]); // Default to Medium
  const [selectedCrust, setSelectedCrust] = useState(pizzaCrusts[1]); // Default to Regular
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [toppingPlacement, setToppingPlacement] = useState<Record<string, 'whole' | 'left' | 'right'>>({});

  const handleToppingChange = (toppingId: string, checked: boolean) => {
    if (checked) {
      setSelectedToppings([...selectedToppings, toppingId]);
      setToppingPlacement({ ...toppingPlacement, [toppingId]: 'whole' });
    } else {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
      const newPlacements = { ...toppingPlacement };
      delete newPlacements[toppingId];
      setToppingPlacement(newPlacements);
    }
  };

  const handleToppingPlacementChange = (toppingId: string, placement: 'whole' | 'left' | 'right') => {
    setToppingPlacement({ ...toppingPlacement, [toppingId]: placement });
  };

  const calculateTotalPrice = () => {
    const basePrice = selectedSize.basePrice;
    const crustPrice = selectedCrust.priceAdjustment;
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = pizzaToppings.find((t) => t.id === toppingId);
      return total + (topping?.priceAdjustment || 0);
    }, 0);

    return basePrice + crustPrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    const customizedPizza = {
      ...pizza,
      price: calculateTotalPrice(),
      customizations: {
        size: selectedSize,
        crust: selectedCrust,
        toppings: selectedToppings.map((toppingId) => {
          const topping = pizzaToppings.find((t) => t.id === toppingId);
          return {
            id: toppingId,
            name: topping?.name,
            placement: toppingPlacement[toppingId] || 'whole',
          };
        }),
        specialInstructions,
      },
    };

    onAddToCart(customizedPizza);
    onClose();
  };

  const toppingsByCategory = pizzaToppings.reduce((acc, topping) => {
    if (!acc[topping.category]) {
      acc[topping.category] = [];
    }
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, typeof pizzaToppings>);

  const categories = Object.keys(toppingsByCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Customize Your Pizza</DialogTitle>
          <DialogDescription>
            Make it exactly how you like it!
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          <div>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Choose Size</h3>
              <RadioGroup
                value={selectedSize.id}
                onValueChange={(value) => {
                  const size = pizzaSizes.find((s) => s.id === value);
                  if (size) setSelectedSize(size);
                }}
                className="grid grid-cols-2 gap-2"
              >
                {pizzaSizes.map((size) => (
                  <div key={size.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.id} id={`size-${size.id}`} />
                    <Label htmlFor={`size-${size.id}`} className="flex flex-1 cursor-pointer justify-between">
                      <span>{size.name} ({size.diameter}")</span>
                      <span>{formatCurrency(size.basePrice)}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Choose Crust</h3>
              <RadioGroup
                value={selectedCrust.id}
                onValueChange={(value) => {
                  const crust = pizzaCrusts.find((c) => c.id === value);
                  if (crust) setSelectedCrust(crust);
                }}
                className="grid grid-cols-2 gap-2"
              >
                {pizzaCrusts.map((crust) => (
                  <div key={crust.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={crust.id} id={`crust-${crust.id}`} />
                    <Label htmlFor={`crust-${crust.id}`} className="flex flex-1 cursor-pointer justify-between">
                      <span>{crust.name}</span>
                      {crust.priceAdjustment > 0 && (
                        <span>+{formatCurrency(crust.priceAdjustment)}</span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Any special requests for your pizza?"
                rows={2}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Choose Toppings</h3>
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="mb-2 grid w-full grid-cols-4">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="space-y-2">
                    {toppingsByCategory[category].map((topping) => (
                      <div key={topping.id} className="flex items-start justify-between rounded-md border p-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`topping-${topping.id}`}
                            checked={selectedToppings.includes(topping.id)}
                            onCheckedChange={(checked) => handleToppingChange(topping.id, checked === true)}
                          />
                          <Label htmlFor={`topping-${topping.id}`} className="cursor-pointer">
                            {topping.name}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedToppings.includes(topping.id) && (
                            <div className="flex items-center space-x-1 text-sm">
                              <button
                                type="button"
                                onClick={() => handleToppingPlacementChange(topping.id, 'whole')}
                                className={`rounded px-2 py-1 ${
                                  toppingPlacement[topping.id] === 'whole'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100'
                                }`}
                              >
                                Whole
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToppingPlacementChange(topping.id, 'left')}
                                className={`rounded px-2 py-1 ${
                                  toppingPlacement[topping.id] === 'left'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100'
                                }`}
                              >
                                Left
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToppingPlacementChange(topping.id, 'right')}
                                className={`rounded px-2 py-1 ${
                                  toppingPlacement[topping.id] === 'right'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100'
                                }`}
                              >
                                Right
                              </button>
                            </div>
                          )}
                          <span className="text-sm font-medium">
                            +{formatCurrency(topping.priceAdjustment)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{pizza.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedSize.name}, {selectedCrust.name} Crust
                {selectedToppings.length > 0 && (
                  <>
                    {' with '}
                    {selectedToppings
                      .map((id) => {
                        const topping = pizzaToppings.find((t) => t.id === id);
                        return topping?.name;
                      })
                      .join(', ')}
                  </>
                )}
              </p>
            </div>
            <div className="text-xl font-bold">{formatCurrency(calculateTotalPrice())}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}