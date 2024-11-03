import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client"; // import the Prisma namespace

export async function POST(req: Request) {
  try {
    // extract data from request body
    const { title, code, explanation, tags, language } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any; };

    // check for missing required fields
    if (!title || !code || !language) {
      return Response.json(
        { error: "title, code, and language are required." },
        { status: 400 } // bad request
      );
    }

    // create the new template in the database
    const newTemplate = await prisma.template.create({
      data: {
        owner: username,
        title,
        code,
        explanation,
        language,
      }
    });

    // these tags will automatically be attached to the new template by our constraint
    const createdTags = await Promise.all(
      tags.map(async (tag: string) => {
        return await prisma.templateTag.create({
          data: {
            t_id: newTemplate.t_id,
            tag,
          },
        });
      })
    );

    console.log(newTemplate);
    return Response.json({ newTemplate }, { status: 201 });
  }
  catch (e) {
    console.error(e);

    // handle specific Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // unique constraint violation (e.g., template title already exists for the owner)
        return Response.json(
          { error: "template with this title already exists for this user." },
          { status: 409 } // conflict status
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
        { error: "failed to save code template" },
        { status: 500 } // internal server error
      );
    }
    // note: some of the above error handling code was provided by ChatGPT
  }
}
