import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseJwt } from '@/lib/jwt-utils';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = parseJwt(token);
  const userId = decoded?.sub;

  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: response.status });
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
