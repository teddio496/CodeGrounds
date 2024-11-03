import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";
import { getNewAccessToken, updateCookies } from "./app/api/auth/refresh/route";
// note: cannot use getPayload from utils/payload because it uses jsonwebtoken

export async function middleware(req: NextRequest) {
  // console.log("REACHED MIDDLEWARE");

  // OLD: authorization header setup
  // const authHeader = req.headers.get("Authorization");
  // if (!authHeader) {
  //   // can also redirect using NextResponse.redirect()
  //   // ref: https://nextjs.org/docs/app/building-your-application/routing/middleware
  //   return NextResponse.json({ message: "authorization header missing" });
  // }
  // const token = authHeader.split(" ")[1];
  // console.log("THIS IS THE TOKEN: " + token);
  const accessToken = req.cookies.get("accessToken")?.value;
  // console.log("THIS IS THE TOKEN: ", accessToken);
  try {
    const { payload } = await jwtVerify(accessToken as string, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    const res = NextResponse.next();
    res.headers.set("payload", JSON.stringify(payload));
    return res;
  }
  catch (e: any) {
    console.log(e);
    if (e instanceof JWTExpired) {
      console.log("TOKEN WAS EXPIRED, REFRESHING...");
      let refreshToken = req.cookies.get("refreshToken")?.value;
      const newAccessToken = await getNewAccessToken(refreshToken as string);
      if (newAccessToken === "REFRESH TOKEN EXPIRED") {
        return NextResponse.redirect(new URL("/login", req.url)); // doesn't work... NEXT JS DEVS PLS FIX
      }
      if (!newAccessToken) {
        return NextResponse.json({ error: "refresh token failed" }, { status: 500 });
      }
      // if reached here then token was successfully refreshed, jwtVerify() should work so no more error handling
      const { payload } = await jwtVerify(newAccessToken as string, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
      const res = NextResponse.next();
      await updateCookies(newAccessToken, res);
      // console.log(payload)
      res.headers.set("payload", JSON.stringify(payload));
      return res;
    } else if (e.code === "ERR_JWS_INVALID" || e.name === "JWSInvalid") {
      return NextResponse.json({ error: "invalid jwt format" }, { status: 400 });
    } else {
      return NextResponse.json({ error: "something went wrong in middleware" }, { status: 500 });
    }
  }
}

export const config = {
  matcher: ["/api/auth/protected/:path*"],
};