import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  // console.log("REACHED");
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    // can also redirect using NextResponse.redirect()
    // ref: https://nextjs.org/docs/app/building-your-application/routing/middleware
    return NextResponse.json({ message: "authorization header missing" });
  }
  const token = authHeader.split(' ')[1];
  // console.log(authHeader.split(' '));
  // console.log(token);
  try {
    jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    // console.log("REACHED");
    return NextResponse.next();
  }
  catch (e) {
    console.log(e);
    return NextResponse.json({ error: "invalid or expired token" });
  }
}

export const config = {
  matcher: ['/api/auth/protected/:path*'],
};