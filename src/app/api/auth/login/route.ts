import { prisma } from "@/utils/prismaClient";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { username },
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
    };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "5h" }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "5h" }
    );

    const res = NextResponse.json({ accessToken, refreshToken }, { status: 201 });
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "something went wrong with login" });
  }
}