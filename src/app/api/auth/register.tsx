import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
const bcrypt = require("bcrypt");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { username, password, role } = req.body;
    const saltRounds = 10;
    try {
      const hashedPass = await bcrypt.hash(password, saltRounds);
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPass,
        },
      });
      return res.status(201).json({ user: user });
    }
    catch (error) {
      console.error(error);
      return res.status(400).json({ error: "failed to create user" });
    }
  }
}