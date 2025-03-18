'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Edit, ChevronLeft, QrCode } from 'lucide-react';
import Link from 'next/link';
import { TableStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type Table = {
  id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  status: TableStatus;
  qrCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function TablesManagementPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const { toast } = useToast();

  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: '4',
    location: '',
  });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some realistic demo data
        const demoTables: Table[] = [
          {
            id: '1',
            tableNumber: 1,
            capacity: 2,
            location: 'Window',
            status: TableStatus.AVAILABLE,
            qrCode: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            tableNumber: 2,
            capacity: 4,
            location: 'Window',
            status: TableStatus.OCCUPIED,
            qrCode: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            tableNumber: 3,
            capacity: 4,
            location: 'Center',
            status: TableStatus.AVAILABLE,
            qrCode: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '4',
            tableNumber: 4,
            capacity: 6,
            location: 'Center',
            status: TableStatus.RESERVED,
            qrCode: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '5',
            tableNumber: 5,
            capacity: 8,
            location: 'Patio',
            status: TableStatus.AVAILABLE,
            qrCode: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setTables(demoTables);

        // Extract unique locations
        const uniqueLocations = Array.from(new Set(demoTables.map(table => table.location)));
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching tables:', error);
        toast({
          title: 'Error',
          description: 'Failed to load table data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [toast]);

  const handleCreateTable = async () => {
    // This would connect to an API endpoint to create the table
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'Creating new tables will be available soon.',
    });
  };

  const handleDeleteTable = async (id: string) => {
    // This would connect to an API endpoint to delete the table
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'Deleting tables will be available soon.',
    });
  };

  const handleGenerateQRCode = async (id: string) => {
    // This would connect to an API endpoint to generate a QR code
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'QR code generation will be available soon.',
    });
  };

  const filteredTables = activeLocation
    ? tables.filter(table => table.location === activeLocation)
    : tables;

  const getStatusBadgeColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case TableStatus.OCCUPIED:
        return 'bg-red-100 text-red-800';
      case TableStatus.RESERVED:
        return 'bg-blue-100 text-blue-800';
      case TableStatus.CLEANING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Select
                  value={newTable.capacity}
                  onValueChange={(value) => setNewTable({...newTable, capacity: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Seats</SelectItem>
                    <SelectItem value="4">4 Seats</SelectItem>
                    <SelectItem value="6">6 Seats</SelectItem>
                    <SelectItem value="8">8 Seats</SelectItem>
                    <SelectItem value="10">10 Seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newTable.location}
                  onValueChange={(value) => setNewTable({...newTable, location: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newTable.location === 'new' && (
                <div className="grid gap-2">
                  <Label htmlFor="newLocation">New Location Name</Label>
                  <Input
                    id="newLocation"
                    placeholder="Enter new location name"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateTable}>Create Table</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeLocation === null ? "default" : "outline"}
          onClick={() => setActiveLocation(null)}
        >
          All Locations
        </Button>
        {locations.map((location) => (
          <Button
            key={location}
            variant={activeLocation === location ? "default" : "outline"}
            onClick={() => setActiveLocation(location)}
          >
            {location}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading table data...</p>
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tables found in this location.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.tableNumber}</TableCell>
                    <TableCell>{table.capacity} seats</TableCell>
                    <TableCell>{table.location}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(table.status)}>
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {table.qrCode ? (
                        <a
                          href={table.qrCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View QR
                        </a>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateQRCode(table.id)}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteTable(table.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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