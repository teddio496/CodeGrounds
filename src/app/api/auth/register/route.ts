import { prisma } from "@/utils/prismaClient";
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  console.log(username, password);
  const saltRounds = 10;
  try {
    const hashedPass = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPass,
      },
    });
    return Response.json({ user: user });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to create user" });
  }
}