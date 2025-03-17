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

// GET endpoint to retrieve categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleError(error);
  }
}