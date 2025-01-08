import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        avatar: true,
        createdAt: true
      },
    });
    // if already logged in and got past middleware to arrive here,
    // then definitely username is correct
    return Response.json({ user }, { status: 200 });
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
        { error: "failed to create edit profile" },
        { status: 500 } // internal server error
      );
    }
    // note: some of the above error handling code was provided by ChatGPT
  }
}