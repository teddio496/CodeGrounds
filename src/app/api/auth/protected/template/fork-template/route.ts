import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client"; // import the Prisma namespace

export async function POST(req: Request) {
  try {
    const { t_id, title } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const forkingFrom = await prisma.template.findUnique({ where: { t_id } });

    if (!forkingFrom) {
      return Response.json({ error: "template not found." }, { status: 404 }); // not found
    }

    const yourTitles = await prisma.template.findMany({
      where: {
        owner: username
      },
      select: { title: true }
    });

    const onlyTitles = yourTitles.map((template) => template.title);
    let new_title = ''
    if (onlyTitles.includes(title) || (!title && onlyTitles.includes(forkingFrom.title))) {
      new_title = title + "(forked)"
    }

    const fork = await prisma.template.create({
      data: {
        language: forkingFrom.language,
        code: forkingFrom.code,
        title: new_title ? new_title : (title ? title : forkingFrom.title),
        owner: username,
        explanation: "",
        forkedFrom: t_id,
      }
    });
    return Response.json({ fork }, { status: 201 });
  }
  catch (e) {
    console.error(e);

    // handle specific Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // unique constraint violation (e.g., title already exists for this user)
        return Response.json(
          { error: "template with this title already exists for this user." },
          { status: 409 } // conflict status
        );
      } else {
        // other Prisma known request errors
        return Response.json(
          { error: e.message },
          { status: 401 } // bad request for other validation issues
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
        { error: "failed to fork template" },
        { status: 500 } // internal server error
      );
    }
  }
}
