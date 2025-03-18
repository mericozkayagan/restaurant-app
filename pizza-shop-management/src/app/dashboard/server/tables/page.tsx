'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

type Table = {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'NEEDS_CLEANING';
  location: string;
  currentOrderCount: number;
};

export default function TablesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some demo data that would typically come from the API
        const demoTables: Table[] = Array.from({ length: 12 }, (_, i) => {
          const tableNumber = i + 1;
          const statuses: Array<'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'NEEDS_CLEANING'> = [
            'AVAILABLE', 'OCCUPIED', 'RESERVED', 'NEEDS_CLEANING'
          ];

          // Randomly assign status but make more tables occupied/available for realism
          const statusIndex = Math.random() < 0.7
            ? (Math.random() < 0.6 ? 0 : 1) // 60% available, 40% occupied from the 70%
            : (Math.random() < 0.5 ? 2 : 3); // 50/50 reserved or needs cleaning from the remaining 30%

          return {
            id: tableNumber.toString(),
            tableNumber,
            capacity: 2 + (tableNumber % 3) * 2, // Capacities of 2, 4, 6
            status: statuses[statusIndex],
            location: tableNumber <= 6 ? 'Main Floor' : (tableNumber <= 10 ? 'Patio' : 'Private Room'),
            currentOrderCount: statuses[statusIndex] === 'OCCUPIED' ? Math.floor(Math.random() * 3) + 1 : 0
          };
        });

        setTables(demoTables);
        setFilteredTables(demoTables);
      } catch (error) {
        console.error('Error fetching tables:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tables. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTables(tables);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTables(
        tables.filter(
          (table) =>
            table.tableNumber.toString().includes(query) ||
            table.location.toLowerCase().includes(query) ||
            table.status.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, tables]);

  const getStatusStyles = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500';
      case 'OCCUPIED':
        return 'bg-orange-500';
      case 'RESERVED':
        return 'bg-blue-500';
      case 'NEEDS_CLEANING':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCreateNewOrder = (tableId: string) => {
    router.push(`/dashboard/server/orders/new?tableId=${tableId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-24">
        <p>Loading tables...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
          <p className="text-muted-foreground">
            Manage table assignments and orders
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tables..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <Card key={table.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Table {table.tableNumber}</CardTitle>
                <Badge className={`${getStatusStyles(table.status)} text-white`}>
                  {table.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>{table.location}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{table.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Orders:</span>
                  <span>{table.currentOrderCount}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-4">
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link href={`/dashboard/server/tables/${table.id}`}>
                  View Details
                </Link>
              </Button>
              <Button
                onClick={() => handleCreateNewOrder(table.id)}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={table.status === 'NEEDS_CLEANING'}
              >
                New Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No tables found</p>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query
            </p>
          )}
        </div>
      )}
    </div>
  );
}