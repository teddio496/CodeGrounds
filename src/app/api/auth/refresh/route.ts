import * as jwt from "jsonwebtoken";

const verifyRefreshToken = (token: string): jwt.JwtPayload | null => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET || "defaultRefreshSecret";
  try {
    return jwt.verify(token, secretKey) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

const generateAccessToken = (user: jwt.JwtPayload) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET || "defaultSecret";
  return jwt.sign({ username: user.username }, secretKey, { expiresIn: "30m" });
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
