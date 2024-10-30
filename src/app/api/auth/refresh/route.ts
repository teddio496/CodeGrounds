import * as jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

const verifyRefreshToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;
  } catch (e) {
    return null;
  }
};

const generateAccessToken = (user: jwt.JwtPayload) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET || "defaultSecret";
  return jwt.sign({ username: user.username }, secretKey, { expiresIn: "30m" });
};

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json({ message: "Refresh token missing" });
  }

  const user = verifyRefreshToken(refreshToken);
  if (!user) {
    return Response.json({ error: "Invalid or expired refresh token" });
  }

  const newAccessToken = generateAccessToken(user);
  return Response.json({ accessToken: newAccessToken });
}
