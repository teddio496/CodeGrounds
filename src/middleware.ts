import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
// note: cannot use getPayload from utils/payload because it uses jsonwebtoken

export async function middleware(req: NextRequest) {
  console.log("REACHED MIDDLEWARE");
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    // can also redirect using NextResponse.redirect()
    // ref: https://nextjs.org/docs/app/building-your-application/routing/middleware
    return NextResponse.json({ message: "authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  // console.log("THIS IS THE TOKEN: " + token);
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));

    console.log("payload received from middleware:", payload);
    console.log("REACHED PAST VERIFY TOKEN");

    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("payload", JSON.stringify(payload));
    return NextResponse.next({
      request: {
        headers: reqHeaders,
      }
    });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: "invalid or expired token", status: 400 });
  }
}

export const config = {
  matcher: ["/api/auth/protected/:path*"],
};