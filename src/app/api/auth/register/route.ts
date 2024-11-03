import { prisma } from "@/utils/prismaClient";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client"; // import the Prisma namespace

export async function POST(req: Request) {
  try {
    // extract username and password from request body
    const { username, password } = await req.json();

    // check for empty JSON or missing required fields
    if (!username || !password) {
      return Response.json(
        { error: "username and password are required." },
        { status: 400 } // bad request
      );
    }

    const saltRounds = 10;

    // convert password to a string before hashing it
    const hashedPass = await bcrypt.hash(String(password), saltRounds);

    // create the user in the database
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPass,
      },
    });

    // remove the password from the response
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({ user: userWithoutPassword }, { status: 201 });
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
        { error: "failed to register user" },
        { status: 500 } // internal server error
      );
    }
    // note: some of the above error handling code was provided by ChatGPT
  }
}
