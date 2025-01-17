// ref: https://github.com/prisma/prisma/discussions/11795#discussioncomment-2171899
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as File) || null;
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };


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

    // handle specific Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // unique constraint violation (e.g., username already exists)
        return Response.json(
          { error: "username already exists" },
          { status: 409 } // conflict status
        );
      } else if (e.code === "P2025") {
        // record not found (not applicable in this context but good to handle)
        return Response.json(
          { error: "record not found" },
          { status: 404 }
        );
      } else {
        // other Prisma known request errors
        return Response.json(
          { error: e.message },
          { status: 400 } // bad request for other validation issues
        );
      }
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      // validation error (e.g., input not matching schema)
      return Response.json(
        { error: "validation error: " + e.message },
        { status: 422 } // unprocessable entity
      );
    } else {
      // unexpected error
      return Response.json(
        { error: "failed to edit-avatar" },
        { status: 500 } // internal server error
      );
    }
    // note: some of the above error handling code was provided by ChatGPT
  }
};