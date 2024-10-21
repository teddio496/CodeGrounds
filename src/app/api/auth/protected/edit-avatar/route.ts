// ref: https://github.com/prisma/prisma/discussions/11795#discussioncomment-2171899

import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as File) || null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      const filePath = path.resolve(UPLOAD_DIR, (body.file as File).name);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${(body.file as File).name}`;

      return NextResponse.json({ success: "updated avatar", fileUrl });
    }
    else {
      return NextResponse.json({ error: "file doesn't exist" });
    }
  }
  catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
};

// async function fileToBase64(file: File): Promise<string> {
//   const reader = new FileReader();
//   return new Promise((resolve, reject) => {
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//     reader.readAsDataURL(file);
//   });
// }