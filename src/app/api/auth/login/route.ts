import { prisma } from "@/utils/db";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export async function POST(req: Request) {
  const { username, password } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return Response.json({ error: "invalid username" });
    }
    // compare the passwords
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return Response.json({ error: "invalid password" });
    }
    // credentials are valid, generate a JWT
    const payload = {
      username: user.username,
      expiresAt: Math.floor(Date.now() / 1000) + (60 * 15),
    };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "5h" }
    );
    return Response.json({ accessToken: accessToken, refreshToken: refreshToken });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "something went wrong with login" });
  }
}