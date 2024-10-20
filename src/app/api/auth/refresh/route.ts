import { JWTPayload } from "jose";

const jwt = require("jsonwebtoken");

const verifyRefreshToken = (token: string) => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET || "defaultRefreshSecret";
  try {
    return jwt.verify(token, secretKey) as JWTPayload;
  } catch (error) {
    return null;
  }
};

const generateAccessToken = (user: JWTPayload) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET || "defaultSecret";
  const expiresIn = "15m";
  return jwt.sign({ username: user.username }, secretKey, { expiresIn });
};

export async function POST(req: Request) {
  const { refreshToken } = await req.json();
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
