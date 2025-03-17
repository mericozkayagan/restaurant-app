'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Utensils, Clock, PlusCircle, Home, ChefHat, Settings, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for demonstration
const mockTables = [
  { id: '1', tableNumber: 1, capacity: 2, status: 'AVAILABLE', location: 'Window' },
  { id: '2', tableNumber: 2, capacity: 4, status: 'OCCUPIED', location: 'Window' },
  { id: '3', tableNumber: 3, capacity: 4, status: 'OCCUPIED', location: 'Center' },
  { id: '4', tableNumber: 4, capacity: 6, status: 'RESERVED', location: 'Center' },
  { id: '5', tableNumber: 5, capacity: 2, status: 'OCCUPIED', location: 'Window' },
  { id: '6', tableNumber: 6, capacity: 8, status: 'AVAILABLE', location: 'Patio' },
  { id: '7', tableNumber: 7, capacity: 4, status: 'CLEANING', location: 'Patio' },
  { id: '8', tableNumber: 8, capacity: 2, status: 'OCCUPIED', location: 'Center' },
  { id: '9', tableNumber: 9, capacity: 4, status: 'AVAILABLE', location: 'Center' },
  { id: '10', tableNumber: 10, capacity: 6, status: 'RESERVED', location: 'Window' },
  { id: '11', tableNumber: 11, capacity: 2, status: 'AVAILABLE', location: 'Patio' },
  { id: '12', tableNumber: 12, capacity: 4, status: 'AVAILABLE', location: 'Center' },
];

export default function ServerDashboardPage() {
  const [tables, setTables] = useState(mockTables);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const router = useRouter();

  const filteredTables = selectedLocation
    ? tables.filter((table) => table.location === selectedLocation)
    : tables;

  const locations = Array.from(new Set(tables.map((table) => table.location)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CLEANING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleTableClick = (tableId: string) => {
    // In a real application, this would direct to the table page
    // For now we'll just log it
    console.log(`Navigating to table ${tableId}`);

    // To show we can navigate to orders for this table
    // Since we don't have the actual pages yet, we'll navigate to a placeholder
    // This would be replaced with real routes when they exist
    router.push(`/dashboard/server/tables/${tableId}`);
  };

  const handleCreateNewOrder = () => {
    router.push('/dashboard/server/orders/new');
  };

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Server Dashboard</h1>
          <p className="text-muted-foreground">
            Manage tables, orders, and customer service.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={16} />
              Home
            </Button>
          </Link>
          <Link href="/dashboard/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings size={16} />
              Admin
            </Button>
          </Link>
          <Link href="/dashboard/kitchen">
            <Button variant="outline" className="flex items-center gap-2">
              <ChefHat size={16} />
              Kitchen
            </Button>
          </Link>
          <Link href="/customer">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Customer View
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        {/* Filter buttons */}
        <div className="flex space-x-4">
          <Button
            variant={selectedLocation === null ? 'default' : 'outline'}
            onClick={() => setSelectedLocation(null)}
          >
            All Locations
          </Button>
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? 'default' : 'outline'}
              onClick={() => setSelectedLocation(location)}
            >
              {location}
            </Button>
          ))}
        </div>

        {/* New Order button */}
        <Button
          onClick={handleCreateNewOrder}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table.id)}
            className="cursor-pointer"
          >
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  Table {table.tableNumber}
                </CardTitle>
                <Badge
                  className={`${getStatusColor(table.status)} border px-2 py-1 text-xs font-semibold`}
                >
                  {table.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    Capacity: {table.capacity}
                  </div>
                  <div className="flex items-center text-sm">
                    <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                    Location: {table.location}
                  </div>
                  {table.status === 'OCCUPIED' && (
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      Seated: 45 minutes ago
                    </div>
                  )}
                  {table.status === 'RESERVED' && (
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      Reserved for: 7:30 PM
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}