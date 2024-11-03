import { prisma } from "@/utils/prismaClient";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return Response.json({ error: "invalid username" }, { status: 401 });
    }

    // compare the passwords
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return Response.json({ error: "invalid password" }, { status: 401 });
    }

    // credentials are valid, generate a JWT
    const payload = {
      username: user.username,
      role: user.role
    };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "20m" }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // set tokens inside cookies
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
        { error: "failed to login" },
        { status: 500 } // internal server error
      );
    }
    // note: some of the above error handling code was provided by ChatGPT
  }
}