'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardholderName: z.string().min(3, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  tipAmount: z.number().min(0, 'Tip cannot be negative'),
});

interface PaymentFormProps {
  order: {
    id: string;
    orderNumber: string;
    subtotal: number;
    tax: number;
    total: number;
    items: any[];
  };
  onPaymentComplete: (paymentDetails: any) => void;
}

export default function PaymentForm({ order, onPaymentComplete }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      tipAmount: 0,
    },
  });

  const calculateTip = () => {
    if (tipPercentage === 0 && customTip) {
      return parseFloat(customTip);
    }
    return (order.subtotal * tipPercentage) / 100;
  };

  const calculateTotal = () => {
    return order.subtotal + order.tax + calculateTip();
  };

  const handleTipChange = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomTip(value);
      setTipPercentage(0);
    }
  };

  const onSubmit = async (data: any) => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const paymentDetails = {
      orderId: order.id,
      paymentMethod,
      tipAmount: calculateTip(),
      total: calculateTotal(),
      ...data,
    };

    onPaymentComplete(paymentDetails);
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your payment for order #{order.orderNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="card"
              onClick={() => setPaymentMethod('CREDIT_CARD')}
            >
              Credit Card
            </TabsTrigger>
            <TabsTrigger
              value="cash"
              onClick={() => setPaymentMethod('CASH')}
            >
              Cash
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              onClick={() => setPaymentMethod('MOBILE_PAYMENT')}
            >
              Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  {...register('cardNumber')}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  {...register('cardholderName')}
                />
                {errors.cardholderName && (
                  <p className="text-sm text-red-500">{errors.cardholderName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    {...register('expiryDate')}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    {...register('cvv')}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-500">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label>Tip Amount</Label>
                <RadioGroup
                  defaultValue="15"
                  className="grid grid-cols-4 gap-2"
                  value={tipPercentage.toString()}
                  onValueChange={(value) => handleTipChange(parseInt(value))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="tip-0" />
                    <Label htmlFor="tip-0">No Tip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="tip-15" />
                    <Label htmlFor="tip-15">15%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18" id="tip-18" />
                    <Label htmlFor="tip-18">18%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="20" id="tip-20" />
                    <Label htmlFor="tip-20">20%</Label>
                  </div>
                </RadioGroup>

                <div className="mt-2">
                  <Label htmlFor="customTip">Custom Tip</Label>
                  <Input
                    id="customTip"
                    placeholder="Enter custom tip amount"
                    value={customTip}
                    onChange={handleCustomTipChange}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2 rounded-md bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>{formatCurrency(calculateTip())}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="cash">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-gray-500">
                Please pay the server directly with cash.
              </p>

              <div className="mt-6 space-y-2">
                <Label>Tip Amount</Label>
                <RadioGroup
                  defaultValue="15"
                  className="grid grid-cols-4 gap-2"
                  value={tipPercentage.toString()}
                  onValueChange={(value) => handleTipChange(parseInt(value))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="cash-tip-0" />
                    <Label htmlFor="cash-tip-0">No Tip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="cash-tip-15" />
                    <Label htmlFor="cash-tip-15">15%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18" id="cash-tip-18" />
                    <Label htmlFor="cash-tip-18">18%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="20" id="cash-tip-20" />
                    <Label htmlFor="cash-tip-20">20%</Label>
                  </div>
                </RadioGroup>

                <div className="mt-2">
                  <Label htmlFor="cashCustomTip">Custom Tip</Label>
                  <Input
                    id="cashCustomTip"
                    placeholder="Enter custom tip amount"
                    value={customTip}
                    onChange={handleCustomTipChange}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2 rounded-md bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>{formatCurrency(calculateTip())}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <Button
                onClick={() =>
                  onPaymentComplete({
                    orderId: order.id,
                    paymentMethod,
                    tipAmount: calculateTip(),
                    total: calculateTotal(),
                  })
                }
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Cash Payment'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-gray-500">
                Scan the QR code below to pay with your mobile device.
              </p>

              <div className="flex justify-center py-6">
                <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">QR Code Placeholder</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label>Tip Amount</Label>
                <RadioGroup
                  defaultValue="15"
                  className="grid grid-cols-4 gap-2"
                  value={tipPercentage.toString()}
                  onValueChange={(value) => handleTipChange(parseInt(value))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="mobile-tip-0" />
                    <Label htmlFor="mobile-tip-0">No Tip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="mobile-tip-15" />
                    <Label htmlFor="mobile-tip-15">15%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18" id="mobile-tip-18" />
                    <Label htmlFor="mobile-tip-18">18%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="20" id="mobile-tip-20" />
                    <Label htmlFor="mobile-tip-20">20%</Label>
                  </div>
                </RadioGroup>

                <div className="mt-2">
                  <Label htmlFor="mobileCustomTip">Custom Tip</Label>
                  <Input
                    id="mobileCustomTip"
                    placeholder="Enter custom tip amount"
                    value={customTip}
                    onChange={handleCustomTipChange}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2 rounded-md bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>{formatCurrency(calculateTip())}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <Button
                onClick={() =>
                  onPaymentComplete({
                    orderId: order.id,
                    paymentMethod,
                    tipAmount: calculateTip(),
                    total: calculateTotal(),
                  })
                }
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Mobile Payment'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Split Bill</Button>
      </CardFooter>
    </Card>
  );
}