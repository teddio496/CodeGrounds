// ref: https://github.com/prisma/prisma/discussions/11795#discussioncomment-2171899
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as File) || null;
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    console.log("USERNAME: " + username);

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      const filePath = path.resolve(UPLOAD_DIR, (body.file as File).name);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${(body.file as File).name}`;

      const updatedUser = await prisma.user.update({
        where: {
          username
        },
        data: {
          avatar: fileUrl
        }
      });

      return NextResponse.json({ updatedUser }, { status: 200 });
    }
    else {
      return NextResponse.json({ error: "file doesn't exist" }, { status: 404 });
    }
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
};