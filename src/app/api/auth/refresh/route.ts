import { jwtVerify, SignJWT } from "jose";
import { NextResponse, type NextRequest } from "next/server";

export async function getNewAccessToken(refreshToken: string) {
  console.log("THE REFRESH TOKEN: " + refreshToken);

  if (!refreshToken) {
    console.error("refresh token not passed to getNewAccessToken()");
    return null;
  }
  
  try {
    console.log("HERE");
    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
    const newAccessToken = await new SignJWT({ username: payload.username, role: payload.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    console.log("THE NEW ACCESS TOKEN: " + newAccessToken);
    return newAccessToken;
  }
  catch (e) {
    console.error("refresh token expired ", e);
    return null;
  }
}

export async function updateCookies(accessToken: string, res: NextResponse) {
  if (!accessToken) {
    console.error("access token not passed to updateCookies()");
    return null;
  }
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
}

// main POST handler (in case it’s ever called directly)
export async function POST(req: NextRequest) {
  console.log("INSIDE REFRESH TOKEN");

  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return Response.json({ message: "refresh token missing" });
    }

    const newAccessToken = await getNewAccessToken(refreshToken);
    if (!newAccessToken) {
      return Response.json({ message: "refresh token expired or invalid" });
    }

    return Response.json({ accessToken: newAccessToken }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "something went wrong with token refresh" }, { status: 500 });
  }
}
