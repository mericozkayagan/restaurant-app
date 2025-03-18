import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// Helper to handle errors consistently
function handleError(error: any) {
  console.error('API error:', error);
  return NextResponse.json(
    { error: 'Something went wrong' },
    { status: 500 }
  );
}

// GET endpoint to retrieve menu items
export async function GET(request: Request) {
  try {
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Build the query
    const query: any = {
      where: {},
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      take: limit,
    };

    // Filter by category if specified
    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: { contains: category, mode: 'insensitive' } },
      });

      if (categoryRecord) {
        query.where.categoryId = categoryRecord.id;
      }
    }

    // Query database for menu items
    const menuItems = await prisma.menuItem.findMany(query);

    return NextResponse.json(menuItems);
  } catch (error) {
    return handleError(error);
  }
}