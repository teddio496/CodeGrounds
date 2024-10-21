// ref: https://github.com/prisma/prisma/discussions/11795#discussioncomment-2171899

import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import * as jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { file } = await req.json();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "authorization header missing" });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as any);
    const { username } = decoded as jwt.JwtPayload;
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        avatar: file,
      }
    });
    // console.log(updatedUser);
    return NextResponse.json({ updatedUser: updatedUser, success: true });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
};