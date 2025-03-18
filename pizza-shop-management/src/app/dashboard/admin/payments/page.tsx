'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronLeft, Eye, Download, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type Payment = {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
  order: {
    orderNumber: string;
    tableId: string | null;
    table?: {
      tableNumber: number;
    } | null;
  };
  processedBy: {
    name: string;
  };
};

export default function PaymentsManagementPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today');
  const [sortBy, setSortBy] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some realistic demo data
        const demoPayments: Payment[] = [
          {
            id: '1',
            amount: 35.25,
            method: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: 'txn_123456789',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
            order: {
              orderNumber: 'ORD-5123',
              tableId: '2',
              table: {
                tableNumber: 5
              }
            },
            processedBy: {
              name: 'Jane Smith'
            }
          },
          {
            id: '2',
            amount: 58.50,
            method: PaymentMethod.CASH,
            status: PaymentStatus.COMPLETED,
            transactionId: null,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            order: {
              orderNumber: 'ORD-5124',
              tableId: '3',
              table: {
                tableNumber: 3
              }
            },
            processedBy: {
              name: 'Jane Smith'
            }
          },
          {
            id: '3',
            amount: 25.03,
            method: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: 'txn_123456790',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            order: {
              orderNumber: 'ORD-5125',
              tableId: null,
              table: null
            },
            processedBy: {
              name: 'Mike Johnson'
            }
          },
          {
            id: '4',
            amount: 43.49,
            method: PaymentMethod.DEBIT_CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: 'txn_123456791',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            order: {
              orderNumber: 'ORD-5126',
              tableId: null,
              table: null
            },
            processedBy: {
              name: 'Mike Johnson'
            }
          },
          {
            id: '5',
            amount: 102.05,
            method: PaymentMethod.MOBILE_PAYMENT,
            status: PaymentStatus.COMPLETED,
            transactionId: 'txn_123456792',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            order: {
              orderNumber: 'ORD-5120',
              tableId: '1',
              table: {
                tableNumber: 1
              }
            },
            processedBy: {
              name: 'Jane Smith'
            }
          },
          {
            id: '6',
            amount: 47.80,
            method: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.REFUNDED,
            transactionId: 'txn_123456793',
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
            order: {
              orderNumber: 'ORD-5115',
              tableId: '4',
              table: {
                tableNumber: 4
              }
            },
            processedBy: {
              name: 'Mike Johnson'
            }
          },
          {
            id: '7',
            amount: 29.99,
            method: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.PENDING,
            transactionId: 'txn_123456794',
            createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
            order: {
              orderNumber: 'ORD-5110',
              tableId: '5',
              table: {
                tableNumber: 2
              }
            },
            processedBy: {
              name: 'Jane Smith'
            }
          },
        ];

        setPayments(demoPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [toast]);

  // Filter payments based on timeframe
  const getTimeframeDate = () => {
    const now = new Date();
    switch (timeframe) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek;
      case 'month':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth;
      default:
        return new Date(0); // Return epoch time for 'all'
    }
  };

  const filteredPayments = payments
    .filter(payment => {
      // Filter by timeframe
      if (timeframe !== 'all') {
        const paymentDate = new Date(payment.createdAt);
        const timeframeDate = getTimeframeDate();
        if (paymentDate < timeframeDate) {
          return false;
        }
      }

      // Filter by status
      if (statusFilter !== 'ALL' && payment.status !== statusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort payments
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  const getStatusBadgeColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.REFUNDED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodBadgeColor = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return 'bg-purple-100 text-purple-800';
      case PaymentMethod.DEBIT_CARD:
        return 'bg-indigo-100 text-indigo-800';
      case PaymentMethod.CASH:
        return 'bg-green-100 text-green-800';
      case PaymentMethod.MOBILE_PAYMENT:
        return 'bg-blue-100 text-blue-800';
      case PaymentMethod.GIFT_CARD:
        return 'bg-orange-100 text-orange-800';
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

  const getTotalRevenue = () => {
    return filteredPayments
      .filter(p => p.status === PaymentStatus.COMPLETED)
      .reduce((total, payment) => total + payment.amount, 0);
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
          <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue ({timeframe === 'all' ? 'All Time' : timeframe})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalRevenue())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transaction Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.length > 0
                ? formatCurrency(getTotalRevenue() / filteredPayments.length)
                : formatCurrency(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          defaultValue="today"
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'ALL')}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value={PaymentStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
              <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading payment data...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found for the selected period.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                    <TableCell className="font-medium">{payment.order.orderNumber}</TableCell>
                    <TableCell>
                      {payment.order.table ? `Table ${payment.order.table.tableNumber}` : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getMethodBadgeColor(payment.method)}>
                        {payment.method.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.processedBy.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
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