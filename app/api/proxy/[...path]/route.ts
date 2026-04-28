import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params.path.join('/'), 'GET');
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params.path.join('/'), 'POST');
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params.path.join('/'), 'DELETE');
}

async function handleRequest(request: NextRequest, path: string, method: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://profile-classification-api.vercel.app';
  const access_token = request.cookies.get('insighta_access')?.value;
  
  const searchParams = request.nextUrl.searchParams.toString();
  const fullPath = searchParams ? `${path}?${searchParams}` : path;

  try {
    const body = method !== 'GET' ? await request.json().catch(() => ({}) ) : undefined;
    
    const response = await axios({
      method,
      url: `${backendUrl}/${fullPath}`,
      data: body,
      headers: {
        'Authorization': access_token ? `Bearer ${access_token}` : '',
        'X-API-Version': request.headers.get('X-API-Version') || '1',
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // Don't throw on 401, we want to return the status
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy Error:', error.message);
    return NextResponse.json({ status: 'error', message: 'Proxy failed' }, { status: 500 });
  }
}
