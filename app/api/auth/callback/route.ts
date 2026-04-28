import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://profile-classification-api.vercel.app';
    const portalCallbackUrl = `${new URL(request.url).origin}/api/auth/callback`;
    
    console.log('Exchanging code for tokens...', { portalCallbackUrl });

    // 1. Exchange code for tokens via the Backend
    const response = await axios.post<TokenResponse>(`${backendUrl}/auth/github/callback`, {
      code,
      state,
      redirect_uri: portalCallbackUrl,
    }).catch(err => {
      console.error('Backend Exchange Error Detail:', err.response?.data || err.message);
      throw err;
    });

    console.log('Tokens received successfully');
    const { access_token, refresh_token } = response.data;

    // 2. Set HTTP-only cookies on the PORTAL domain
    const res = NextResponse.redirect(new URL('/dashboard', request.url));
    
    res.cookies.set('insighta_access', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 180,
      path: '/',
    });

    res.cookies.set('insighta_refresh', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 300,
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Auth Callback Error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
