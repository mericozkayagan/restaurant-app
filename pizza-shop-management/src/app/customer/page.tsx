'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, MapPin, ChevronRight, Search, Bell, Home, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Types for database items
type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: string;
  isActive: boolean;
  category?: {
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
};

type CartItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

export default function CustomerOrderingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu items and categories from the API
  useEffect(() => {
    setIsLoading(true);

    // Fetch menu items
    const fetchMenuItems = async () => {
      try {
        // If a category is selected, fetch items for that category
        const url = activeCategory
          ? `/api/menu?category=${activeCategory}&limit=20`
          : '/api/menu?limit=20';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items');
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    // Execute both fetches in parallel
    Promise.all([fetchMenuItems(), fetchCategories()])
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeCategory]);

  // Update activeCategory when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleOrderClick = (menuItem: MenuItem) => {
    // Add to cart
    const existingItem = cart.find(item => item.menuItemId === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItemId === menuItem.id
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
      toast.success(`Added another ${menuItem.name} to cart`);
    } else {
      setCart([...cart, {
        id: `${menuItem.id}-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: Number(menuItem.price), // Ensure price is a number
        quantity: 1,
        image: menuItem.image
      }]);
      toast.success(`Added ${menuItem.name} to cart`);
    }
  };

  // Filter menu items based on search query
  const filteredMenuItems = searchQuery.trim() === ''
    ? menuItems
    : menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName.toLowerCase());
    router.push(`/customer?category=${categoryName.toLowerCase()}`);
  };

  // Group menu items by category
  const menuItemsByCategory = filteredMenuItems.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-red-600 mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 text-red-600 text-5xl">⚠️</div>
          <p className="text-lg font-medium text-gray-700">{error}</p>
          <Button
            className="mt-4 bg-red-600 hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-black text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-6">
            {/* Logo with link to homepage */}
            <Link href="/" className="text-3xl font-bold text-white flex items-center">
              <span className="bg-blue-600 p-1">P</span>izza Shop
            </Link>

            {/* Main Navigation */}
            <nav className="hidden space-x-6 md:flex">
              <Link href="/customer?category=promotions" className="font-medium hover:text-orange-400">Tüm Kampanyalar</Link>
              <Link href="/customer?category=pizzas" className="font-medium hover:text-orange-400">Tüm Pizzalar</Link>
              <Link href="/customer?category=sides" className="font-medium hover:text-orange-400">Ekstralar & İçecekler</Link>
              <Link href="/customer?category=offers" className="font-medium hover:text-orange-400">Fırsatlar</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/notifications">
              <Bell className="h-6 w-6 cursor-pointer hover:text-orange-400" />
            </Link>
            <Link href="/auth/signin">
              <Button className="rounded-full bg-white px-4 py-2 font-bold text-black hover:bg-gray-200">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/customer/cart" className="relative">
              <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-orange-400" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white p-0 text-xs font-bold text-orange-600">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Navigation Bar - Hidden on customer page in normal use case,
          but kept for development purposes with a subtle background */}
      <div className="bg-gray-800 bg-opacity-80 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-sm hover:text-orange-400">
              <Home className="h-4 w-4 mr-1" />
              Ana Sayfa
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/dashboard/admin" className="text-sm hover:text-orange-400">Yönetici</Link>
            <span className="text-gray-500">/</span>
            <Link href="/dashboard/kitchen" className="text-sm hover:text-orange-400">Mutfak</Link>
            <span className="text-gray-500">/</span>
            <Link href="/dashboard/server" className="text-sm hover:text-orange-400">Garson</Link>
          </div>
        </div>
      </div>

      {/* Location Bar */}
      <div className="border-b border-gray-300 bg-white py-2">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center space-x-2 border-gray-300">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="text-sm">Beklemeden Gel Al</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 border-gray-300">
              <span className="text-sm">Göktepe Şubesi</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Pizza, kampanya veya malzeme ara..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Promotional Banner */}
        <div className="relative bg-red-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 text-center md:mb-0 md:text-left">
                <h2 className="text-3xl font-bold text-white md:text-4xl">RAMAZANDA BOL LEZZET SEPETTE</h2>
                <p className="mt-1 text-5xl font-bold text-white md:text-5xl">100 TL</p>
                <p className="text-xl font-semibold text-white">CEBİNDE</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-lg bg-white p-3 shadow-lg">
                  <p className="font-bold text-gray-800">KOD:</p>
                  <p className="text-xl font-bold text-blue-600">CEPTE100</p>
                </div>
                <div className="mt-4 h-40 w-40 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                  <div className="text-4xl">🍕</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex cursor-pointer flex-col items-center"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full
                  ${activeCategory === category.name.toLowerCase() ? 'bg-orange-100' : 'bg-yellow-50'}
                  shadow transition-all hover:bg-orange-100`}>
                  {category.name === 'Pizzas' && (
                    <span className="text-2xl">🍕</span>
                  )}
                  {category.name === 'Sides' && (
                    <span className="text-2xl">🍟</span>
                  )}
                  {category.name === 'Drinks' && (
                    <span className="text-2xl">🥤</span>
                  )}
                  {category.name === 'Desserts' && (
                    <span className="text-2xl">🍰</span>
                  )}
                  {category.name === 'Promotions' && (
                    <span className="text-2xl">🎁</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium">{category.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mx-auto px-4 pb-12">
          {Object.entries(menuItemsByCategory).map(([categoryName, items]) => (
            <div key={categoryName} className="mb-10">
              <h2 className="mb-6 text-2xl font-bold">{categoryName}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
                    <div className="h-48 w-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {item.category?.name === 'Pizzas' && <div className="text-6xl">🍕</div>}
                      {item.category?.name === 'Sides' && <div className="text-6xl">🍟</div>}
                      {item.category?.name === 'Drinks' && <div className="text-6xl">🥤</div>}
                      {item.category?.name === 'Desserts' && <div className="text-6xl">🍰</div>}
                      {!item.category?.name || !['Pizzas', 'Sides', 'Drinks', 'Desserts'].includes(item.category?.name) && <div className="text-6xl">🍽️</div>}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-bold">${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <Button
                          onClick={() => handleOrderClick(item)}
                          className="rounded-full bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}