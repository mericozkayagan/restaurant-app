import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  return NextResponse.json({
    error: error || 'Unknown error occurred',
    message: getErrorMessage(error),
  });
}

function getErrorMessage(error: string | null): string {
  switch (error) {
    case 'Configuration':
      return 'There is a problem with the server configuration.';
    case 'AccessDenied':
      return 'You do not have permission to sign in.';
    case 'Verification':
      return 'The verification token has expired or has already been used.';
    default:
      return 'Unable to sign in.';
  }
}