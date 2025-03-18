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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Edit, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'ALL'>('ALL');
  const { toast } = useToast();

  const [newStaffMember, setNewStaffMember] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.SERVER,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // In a real implementation, this would fetch from an API endpoint
        // For now, we'll create some realistic demo data
        const demoStaff: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: UserRole.ADMIN,
            createdAt: new Date(2023, 0, 15).toISOString(),
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: UserRole.SERVER,
            createdAt: new Date(2023, 1, 20).toISOString(),
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: UserRole.KITCHEN,
            createdAt: new Date(2023, 2, 10).toISOString(),
          },
          {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            role: UserRole.SERVER,
            createdAt: new Date(2023, 3, 5).toISOString(),
          },
          {
            id: '5',
            name: 'Robert Brown',
            email: 'robert.brown@example.com',
            role: UserRole.KITCHEN,
            createdAt: new Date(2023, 4, 12).toISOString(),
          },
        ];

        setStaff(demoStaff);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [toast]);

  const handleCreateStaff = async () => {
    // This would connect to an API endpoint to create the staff member
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'Creating new staff members will be available soon.',
    });
  };

  const handleDeleteStaff = async (id: string) => {
    // This would connect to an API endpoint to delete the staff member
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'Deleting staff members will be available soon.',
    });
  };

  const filteredStaff = selectedRole === 'ALL'
    ? staff
    : staff.filter(user => user.role === selectedRole);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case UserRole.SERVER:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case UserRole.KITCHEN:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case UserRole.CUSTOMER:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newStaffMember.name}
                  onChange={(e) => setNewStaffMember({...newStaffMember, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaffMember.email}
                  onChange={(e) => setNewStaffMember({...newStaffMember, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStaffMember.password}
                  onChange={(e) => setNewStaffMember({...newStaffMember, password: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newStaffMember.role}
                  onValueChange={(value) => setNewStaffMember({...newStaffMember, role: value as UserRole})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={UserRole.SERVER}>Server</SelectItem>
                    <SelectItem value={UserRole.KITCHEN}>Kitchen Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateStaff}>Create Staff</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff Members</CardTitle>
          <div className="flex gap-2">
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole | 'ALL')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrators</SelectItem>
                <SelectItem value={UserRole.SERVER}>Servers</SelectItem>
                <SelectItem value={UserRole.KITCHEN}>Kitchen Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading staff data...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No staff members found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteStaff(user.id)}
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