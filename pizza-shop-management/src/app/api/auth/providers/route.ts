import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    credentials: {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
    },
  });
}