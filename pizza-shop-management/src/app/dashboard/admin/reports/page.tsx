'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronLeft, Download, BarChart, PieChart, TrendingUp, Utensils, DollarSign, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState('sales');
  const { toast } = useToast();

  // Placeholder data for charts and stats, in a real app these would come from API calls
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    orderCount: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    monthlySales: [],
    salesByCategory: [],
    salesByDayOfWeek: []
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some realistic demo data

        // Simulating API delay
        setTimeout(() => {
          // Sample data for demonstration
          const mockSalesData = {
            totalSales: 8945.75,
            orderCount: 325,
            averageOrderValue: 27.53,
            topSellingItems: [
              { name: 'Pepperoni Pizza', quantity: 76, revenue: 1482.40 },
              { name: 'Margherita Pizza', quantity: 58, revenue: 1131.00 },
              { name: 'Buffalo Wings', quantity: 52, revenue: 779.48 },
              { name: 'Garlic Breadsticks', quantity: 43, revenue: 344.00 },
              { name: 'Meat Lover\'s Pizza', quantity: 37, revenue: 814.00 }
            ],
            monthlySales: [
              { month: 'Jan', sales: 6782.50 },
              { month: 'Feb', sales: 7250.25 },
              { month: 'Mar', sales: 8120.75 },
              { month: 'Apr', sales: 7840.50 },
              { month: 'May', sales: 8430.25 },
              { month: 'Jun', sales: 8945.75 }
            ],
            salesByCategory: [
              { category: 'Pizzas', amount: 5650.50, percentage: 63 },
              { category: 'Sides', amount: 1450.25, percentage: 16 },
              { category: 'Drinks', amount: 945.50, percentage: 11 },
              { category: 'Desserts', amount: 520.75, percentage: 6 },
              { category: 'Other', amount: 378.75, percentage: 4 }
            ],
            salesByDayOfWeek: [
              { day: 'Monday', sales: 950.25 },
              { day: 'Tuesday', sales: 875.50 },
              { day: 'Wednesday', sales: 1125.75 },
              { day: 'Thursday', sales: 1250.50 },
              { day: 'Friday', sales: 1850.25 },
              { day: 'Saturday', sales: 1750.00 },
              { day: 'Sunday', sales: 1143.50 }
            ]
          };

          setSalesData(mockSalesData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report data. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [timeframe, reportType, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Chart rendering would typically use a library like Chart.js, Recharts, or D3
  // Here we'll just create placeholder elements

  const renderMonthlySalesChart = () => {
    // In a real app, this would use a charting library
    return (
      <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Monthly Sales Chart (would use a real chart library in production)
          </p>
        </div>
      </div>
    );
  };

  const renderCategoryPieChart = () => {
    // In a real app, this would use a charting library
    return (
      <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <PieChart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Sales by Category (would use a real chart library in production)
          </p>
        </div>
      </div>
    );
  };

  const renderDayOfWeekChart = () => {
    // In a real app, this would use a charting library
    return (
      <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Sales by Day of Week (would use a real chart library in production)
          </p>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          defaultValue="sales"
          value={reportType}
          onValueChange={setReportType}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={timeframe}
          onValueChange={setTimeframe}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading report data...</p>
        </div>
      ) : (
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesData.totalSales)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesData.orderCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesData.averageOrderValue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Seller</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesData.topSellingItems.length > 0 ? salesData.topSellingItems[0].name : 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>
                  Revenue trends over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderMonthlySalesChart()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across menu categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCategoryPieChart()}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Day of Week</CardTitle>
                <CardDescription>
                  Revenue patterns across different days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderDayOfWeekChart()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>
                  Best performing menu items by quantity sold
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.topSellingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                      </div>
                      <div className="font-medium">{formatCurrency(item.revenue)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      )}

      <TabsContent value="inventory" className="py-12 text-center">
        <h3 className="text-lg font-medium">Inventory Reports</h3>
        <p className="mt-2 text-muted-foreground">Inventory reporting functionality coming soon.</p>
      </TabsContent>

      <TabsContent value="staff" className="py-12 text-center">
        <h3 className="text-lg font-medium">Staff Performance Reports</h3>
        <p className="mt-2 text-muted-foreground">Staff performance reporting functionality coming soon.</p>
      </TabsContent>
    </div>
  );
}