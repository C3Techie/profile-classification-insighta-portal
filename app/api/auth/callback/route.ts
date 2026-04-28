import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://profile-classification-api.vercel.app';
    
    // 1. Exchange code for tokens via the Backend
    // We use the JSON callback endpoint (POST)
    const response = await axios.post(`${backendUrl}/auth/github/callback`, {
      code,
      state,
      redirect_uri: `${new URL(request.url).origin}/api/auth/callback`,
    });

    const { access_token, refresh_token } = response.data;

    // 2. Set HTTP-only cookies on the PORTAL domain
    const res = NextResponse.redirect(new URL('/dashboard', request.url));
    
    res.cookies.set('insighta_access', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      max_age: 180, // 3 mins
      path: '/',
    } as any);

    res.cookies.set('insighta_refresh', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      max_age: 300, // 5 mins
      path: '/',
    } as any);

    return res;
  } catch (error) {
    console.error('Auth Callback Error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
