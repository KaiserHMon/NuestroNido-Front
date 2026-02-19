import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;

    // Construct the backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const endpoint = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${apiUrl}/api/${endpoint}${searchParams ? `?${searchParams}` : ''}`;

    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Prepare headers for the backend request
    const headers = new Headers();

    const contentType = request.headers.get('Content-Type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Get the request body
    const body =
      request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined;

    // Forward the request to the backend
    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    // Get the response body
    const responseData = await response.blob();

    // Create the response headers
    const responseHeaders = new Headers(response.headers);

    // Remove Transfer-Encoding chunked as Next.js handles it
    responseHeaders.delete('Transfer-Encoding');
    // Remove Content-Encoding if we decoded it (fetch does)
    responseHeaders.delete('Content-Encoding');
    responseHeaders.delete('Content-Length');

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
