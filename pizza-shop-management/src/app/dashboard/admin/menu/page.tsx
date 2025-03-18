'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2, Edit, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  calories: number | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isActive: boolean;
  categoryId: string;
  displayOrder: number;
  isPizzaBase: boolean;
  category: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Set default active category if none selected
        if (categoriesData.length > 0 && !activeCategory) {
          setActiveCategory(categoriesData[0].id);
        }

        // Fetch menu items
        const menuResponse = await fetch('/api/menu');
        if (!menuResponse.ok) throw new Error('Failed to fetch menu items');
        const menuData = await menuResponse.json();
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, toast]);

  const handleCreateMenuItem = async () => {
    // This would connect to an API endpoint to create the item
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'Creating new menu items will be available soon.',
    });
  };

  const handleDeleteMenuItem = async (id: string) => {
    // This would connect to an API endpoint to delete the item
    // For now, we'll just show a toast message
    toast({
      title: 'Feature Not Implemented',
      description: 'Deleting menu items will be available soon.',
    });
  };

  const filteredItems = activeCategory
    ? menuItems.filter(item => item.categoryId === activeCategory)
    : menuItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newMenuItem.categoryId}
                    onValueChange={(value) => setNewMenuItem({...newMenuItem, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vegetarian"
                    checked={newMenuItem.isVegetarian}
                    onCheckedChange={(checked) =>
                      setNewMenuItem({...newMenuItem, isVegetarian: checked as boolean})
                    }
                  />
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vegan"
                    checked={newMenuItem.isVegan}
                    onCheckedChange={(checked) =>
                      setNewMenuItem({...newMenuItem, isVegan: checked as boolean})
                    }
                  />
                  <Label htmlFor="vegan">Vegan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="glutenFree"
                    checked={newMenuItem.isGlutenFree}
                    onCheckedChange={(checked) =>
                      setNewMenuItem({...newMenuItem, isGlutenFree: checked as boolean})
                    }
                  />
                  <Label htmlFor="glutenFree">Gluten Free</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateMenuItem}>Create Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              {activeCategory
                ? `Menu Items - ${categories.find(c => c.id === activeCategory)?.name}`
                : 'All Menu Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading menu items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No menu items found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteMenuItem(item.id)}
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
    </div>
  );
}