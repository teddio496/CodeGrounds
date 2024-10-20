import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      if (!user) {
        return res.status(401).json({ error: "invalid username" });
      }
      // compare the passwords
      const isValidPass = await bcrypt.compare(password, user.password);
      if (!isValidPass) {
        return res.status(401).json({ error: "invalid password" });
      }
      // credentials are valid, generate a JWT
      const payload: Payload = {
        username: user.username,
        expiresAt: Math.floor(Date.now() / 1000) + (60 * 15),
      }
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "2h" }
      );
      return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    }
    catch (e) {
      console.error(e);
      return res.status(400).json({ error: "something went wrong with login" });
    }
  }
}