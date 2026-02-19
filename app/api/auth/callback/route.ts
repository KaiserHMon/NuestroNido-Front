import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const token = searchParams.get('token');

  if (token) {
    return setSession(token);
  }

  if (code) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/auth/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to exchange code' }, { status: response.status });
      }

      const data = await response.json();
      // Backend might return { access_token: ... } or { data: { access_token: ... } }
      const accessToken = data.access_token || data.data?.access_token;
      const refreshToken = data.refresh_token || data.data?.refresh_token;

      if (!accessToken) {
        return NextResponse.json({ error: 'No access token in response' }, { status: 500 });
      }

      return setSession(accessToken, refreshToken);
    } catch (error) {
      console.error('Callback proxy error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Missing code or token' }, { status: 400 });
}

async function setSession(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();

  cookieStore.set('auth_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  if (refreshToken) {
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return NextResponse.json({ success: true });
}
