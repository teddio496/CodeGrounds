import * as jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
  console.log("INSIDE REFRESH TOKEN");
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return Response.json({ message: "refresh token missing" });
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;
    if (!payload) {
      return Response.json({ message: "refresh token expired or missing" });
    }
    console.log("HERE IS THE REFRESH TOKEN PAYLOAD'S USERNAME: " + payload.username);
    const newAccessToken = jwt.sign(
      { username: payload.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "5h" }
    );
    return Response.json({ accessToken: newAccessToken }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "something went wrong with token refresh" }, { status: 500 });
  }
}
