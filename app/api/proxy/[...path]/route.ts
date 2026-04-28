import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(request, path.join('/'), 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(request, path.join('/'), 'POST');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(request, path.join('/'), 'DELETE');
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
      responseType: 'arraybuffer', // Handle binary/text data
      validateStatus: () => true,
    });

    const contentType = response.headers['content-type'];
    const contentDisposition = response.headers['content-disposition'];

    return new NextResponse(response.data, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/json',
        ...(contentDisposition && { 'Content-Disposition': contentDisposition }),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy Error:', errorMessage);
    return NextResponse.json({ status: 'error', message: 'Proxy failed' }, { status: 500 });
  }
}
