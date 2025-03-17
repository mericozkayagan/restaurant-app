import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  // Create categories if they don't exist
  const categories = [
    { name: 'Pizzas', description: 'Our delicious pizza selection', displayOrder: 1 },
    { name: 'Sides', description: 'Perfect companions for your pizza', displayOrder: 2 },
    { name: 'Drinks', description: 'Refreshing beverages', displayOrder: 3 },
    { name: 'Desserts', description: 'Sweet treats to finish your meal', displayOrder: 4 },
    { name: 'Promotions', description: 'Special deals and offers', displayOrder: 5 },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: {
          id: randomUUID(),
          ...category,
        },
      });
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
  }

  // Get category IDs for reference
  const pizzaCategory = await prisma.category.findFirst({
    where: { name: 'Pizzas' },
  });

  const sidesCategory = await prisma.category.findFirst({
    where: { name: 'Sides' },
  });

  const drinksCategory = await prisma.category.findFirst({
    where: { name: 'Drinks' },
  });

  if (!pizzaCategory || !sidesCategory || !drinksCategory) {
    throw new Error('Required categories not found');
  }

  // Create pizza menu items
  const pizzas = [
    {
      name: 'Classic Margherita',
      description: 'Fresh mozzarella, tomato sauce, and basil',
      price: 11.99,
      image: 'https://placehold.co/400x300/png?text=Margherita',
      categoryId: pizzaCategory.id,
      isVegetarian: true,
      displayOrder: 1,
      isPizzaBase: true,
    },
    {
      name: 'Pepperoni',
      description: 'Classic pizza with pepperoni, mozzarella, and tomato sauce',
      price: 13.99,
      image: 'https://placehold.co/400x300/png?text=Pepperoni',
      categoryId: pizzaCategory.id,
      displayOrder: 2,
      isPizzaBase: true,
    },
    {
      name: 'Supreme',
      description: 'Loaded with pepperoni, sausage, green peppers, onions, and mushrooms',
      price: 15.99,
      image: 'https://placehold.co/400x300/png?text=Supreme',
      categoryId: pizzaCategory.id,
      displayOrder: 3,
      isPizzaBase: true,
    },
    {
      name: 'BBQ Chicken',
      description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
      price: 14.99,
      image: 'https://placehold.co/400x300/png?text=BBQ+Chicken',
      categoryId: pizzaCategory.id,
      displayOrder: 4,
      isPizzaBase: true,
    },
    {
      name: 'Veggie Delight',
      description: 'Mushrooms, bell peppers, onions, olives, and tomatoes',
      price: 13.99,
      image: 'https://placehold.co/400x300/png?text=Veggie',
      categoryId: pizzaCategory.id,
      isVegetarian: true,
      displayOrder: 5,
      isPizzaBase: true,
    },
  ];

  // Create sides
  const sides = [
    {
      name: 'Garlic Bread',
      description: 'Freshly baked bread with garlic butter',
      price: 4.99,
      image: 'https://placehold.co/400x300/png?text=Garlic+Bread',
      categoryId: sidesCategory.id,
      isVegetarian: true,
      displayOrder: 1,
    },
    {
      name: 'Chicken Wings',
      description: 'Spicy wings with your choice of sauce',
      price: 8.99,
      image: 'https://placehold.co/400x300/png?text=Wings',
      categoryId: sidesCategory.id,
      displayOrder: 2,
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce, croutons, and Caesar dressing',
      price: 6.99,
      image: 'https://placehold.co/400x300/png?text=Caesar+Salad',
      categoryId: sidesCategory.id,
      displayOrder: 3,
    },
  ];

  // Create drinks
  const drinks = [
    {
      name: 'Soft Drink',
      description: 'Your choice of soda',
      price: 2.49,
      image: 'https://placehold.co/400x300/png?text=Soft+Drink',
      categoryId: drinksCategory.id,
      isVegetarian: true,
      isVegan: true,
      displayOrder: 1,
    },
    {
      name: 'Bottled Water',
      description: 'Pure refreshing water',
      price: 1.99,
      image: 'https://placehold.co/400x300/png?text=Water',
      categoryId: drinksCategory.id,
      isVegetarian: true,
      isVegan: true,
      displayOrder: 2,
    },
    {
      name: 'Iced Tea',
      description: 'Freshly brewed unsweetened tea',
      price: 2.99,
      image: 'https://placehold.co/400x300/png?text=Iced+Tea',
      categoryId: drinksCategory.id,
      isVegetarian: true,
      isVegan: true,
      displayOrder: 3,
    },
  ];

  // Combine all items
  const allItems = [...pizzas, ...sides, ...drinks];

  // Add menu items if they don't exist
  for (const item of allItems) {
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        name: item.name,
        categoryId: item.categoryId
      },
    });

    if (!existingItem) {
      await prisma.menuItem.create({
        data: {
          id: randomUUID(),
          ...item,
          isActive: true,
          isGlutenFree: false,
        },
      });
      console.log(`Created menu item: ${item.name}`);
    } else {
      console.log(`Menu item already exists: ${item.name}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });