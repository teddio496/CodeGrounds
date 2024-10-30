import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";
import getRefreshToken from "./app/api/auth/refresh/route";
// note: cannot use getPayload from utils/payload because it uses jsonwebtoken

export async function middleware(req: NextRequest) {
  console.log("REACHED MIDDLEWARE");
  // OLD: authorization header setup
  // const authHeader = req.headers.get("Authorization");
  // if (!authHeader) {
  //   // can also redirect using NextResponse.redirect()
  //   // ref: https://nextjs.org/docs/app/building-your-application/routing/middleware
  //   return NextResponse.json({ message: "authorization header missing" });
  // }
  // const token = authHeader.split(" ")[1];
  // console.log("THIS IS THE TOKEN: " + token);
  let token = req.cookies.get("accessToken")?.value;
  let payload;
  console.log("THIS IS THE TOKEN: ", token);
  try {
    ({ payload } = await jwtVerify(token as string, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)));
  }
  catch (e) {
    if (e instanceof JWTExpired) {
      console.log("TOKEN WAS EXPIRED, REFRESHING...");
      const response = await getRefreshToken(req);
      const { accessToken } = await response.json();
      if (response.ok) {
        token = accessToken;
      } else {
        return NextResponse.json({ error: "refresh token failed" }, { status: 500 });
      }
      // if reached here then token was successfully refreshed, jwtVerify() should work so no more error handling
      payload = await jwtVerify(token as string, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    }
    else {
      console.error(e);
      return NextResponse.json({ error: "something went wrong in middleware" }, { status: 500 });
    }
  }
  finally {
    // attach payload to next request
    console.log(payload);
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("payload", JSON.stringify(payload));
    return NextResponse.next({
      request: {
        headers: reqHeaders,
      }
    });
  }
}

export const config = {
  matcher: ["/api/auth/protected/:path*"],
};