import { NextApiRequest, NextApiResponse } from "next";
const jwt = require("jsonwebtoken");

// Function to verify the refresh token
const verifyRefreshToken = (token: string) => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET || "defaultRefreshSecret"; // Ensure you have a secret
  try {
    return jwt.verify(token, secretKey) as Payload; // Return decoded payload if valid
  } catch (error) {
    return null; // Invalid token
  }
};

// Function to generate a new access token
const generateAccessToken = (user: Payload) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET || "defaultSecret"; // Ensure you have a secret
  const expiresIn = "15m"; // Adjust the expiration time as needed
  return jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn });
};

export default async function refreshToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { refreshToken } = req.body; // Expecting refresh token in the request body
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  // Verify the refresh token
  const user = verifyRefreshToken(refreshToken);
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }

  // Generate a new access token with the same payload
  const newAccessToken = generateAccessToken(user);
  res.status(200).json({ accessToken: newAccessToken });
}
