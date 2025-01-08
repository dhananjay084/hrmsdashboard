import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
export async function middleware(request: Request) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;

  const url = new URL(request.url);

  if (accessToken) {
    return NextResponse.next();
  }

  if (url.pathname !== '/Login') {
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/','/users','/employee','/employee/:path'], 
};
