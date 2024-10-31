import { prisma } from "@/utils/prismaClient";
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPass,
      },
    });
    return Response.json({ user }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to create user" }, { status: 500 });
  }
}