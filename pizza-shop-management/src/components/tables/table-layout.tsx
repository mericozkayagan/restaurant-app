'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TableStatus } from '@prisma/client';

interface TableProps {
  id: string;
  tableNumber: number;
  capacity: number;
  status: string;
  location: string;
  server?: string;
  occupiedSince?: Date;
  reservedFor?: Date;
}

interface TableLayoutProps {
  tables: TableProps[];
  onTableClick: (tableId: string) => void;
  onStatusChange?: (tableId: string, newStatus: string) => void;
}

export default function TableLayout({ tables, onTableClick, onStatusChange }: TableLayoutProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = Array.from(new Set(tables.map((table) => table.location)));

  const filteredTables = selectedLocation
    ? tables.filter((table) => table.location === selectedLocation)
    : tables;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500';
      case 'OCCUPIED':
        return 'bg-red-500';
      case 'RESERVED':
        return 'bg-blue-500';
      case 'CLEANING':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'OCCUPIED':
        return <Badge className="bg-red-100 text-red-800">Occupied</Badge>;
      case 'RESERVED':
        return <Badge className="bg-blue-100 text-blue-800">Reserved</Badge>;
      case 'CLEANING':
        return <Badge className="bg-yellow-100 text-yellow-800">Cleaning</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedLocation === null ? 'default' : 'outline'}
          onClick={() => setSelectedLocation(null)}
        >
          All Areas
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

      <div className="relative h-[600px] w-full overflow-auto rounded-lg border bg-white p-6">
        {/* Restaurant layout grid */}
        <div className="grid grid-cols-6 gap-4">
          {filteredTables.map((table) => (
            <TooltipProvider key={table.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => onTableClick(table.id)}
                  >
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-lg border-2 border-gray-300 ${
                        table.capacity > 4 ? 'h-32 w-32' : ''
                      }`}
                    >
                      <div
                        className={`absolute top-0 right-0 h-3 w-3 rounded-full ${getStatusColor(
                          table.status
                        )}`}
                      />
                      <div className="text-center">
                        <div className="text-lg font-bold">Table {table.tableNumber}</div>
                        <div className="text-sm text-gray-500">{table.capacity} seats</div>
                      </div>
                    </div>
                    {table.server && (
                      <div className="mt-1 text-center text-xs text-gray-500">
                        Server: {table.server}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 p-1">
                    <div className="font-medium">Table {table.tableNumber}</div>
                    <div className="text-xs">Capacity: {table.capacity}</div>
                    <div className="text-xs">Location: {table.location}</div>
                    <div className="text-xs">Status: {getStatusBadge(table.status)}</div>
                    {table.occupiedSince && (
                      <div className="text-xs">
                        Occupied since:{' '}
                        {new Date(table.occupiedSince).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    )}
                    {table.reservedFor && (
                      <div className="text-xs">
                        Reserved for:{' '}
                        {new Date(table.reservedFor).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 rounded-md bg-white p-2 shadow-md">
          <div className="text-sm font-medium">Legend</div>
          <div className="mt-1 flex flex-col space-y-1">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs">Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs">Reserved</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-xs">Cleaning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}