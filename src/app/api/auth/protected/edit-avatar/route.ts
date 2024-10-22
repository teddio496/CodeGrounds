// ref: https://github.com/prisma/prisma/discussions/11795#discussioncomment-2171899

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  try {
    const { file } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        avatar: file,
      }
    });
    return NextResponse.json({ updatedUser: updatedUser, status: 200 });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to upload file", status: 500 });
  }
};