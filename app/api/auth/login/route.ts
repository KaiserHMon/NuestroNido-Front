import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseJwt } from '@/lib/jwt-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    const { access_token, refresh_token } = data;

    // Set cookies
    const cookieStore = await cookies();

    // Auth token cookie
    cookieStore.set('auth_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Refresh token cookie
    if (refresh_token) {
      cookieStore.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Decode token to get user ID
    const decoded = parseJwt(access_token);
    const userId = decoded?.sub;

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
