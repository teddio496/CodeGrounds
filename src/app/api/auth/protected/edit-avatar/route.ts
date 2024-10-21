// ref: https://github.com/prisma/prisma/discussions/11795#discussioncomment-2171899

import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log(Array.from(formData.entries())); // Log the formData entries
    const file = formData.get("file") as File;
    const username = formData.get("username") as string;
    console.log(username);

    if (!file) {
      return NextResponse.json({ error: "File not provided" }, { status: 400 });
    }

    const base64String = await fileToBase64(file);

    await prisma.user.update({
      where: { username: username },
      data: { avatar: base64String },
    });

    return NextResponse.json({ success: "updated avatar" });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
};

async function fileToBase64(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}