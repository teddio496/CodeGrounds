import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";

export async function PUT(req: Request) {
  try {
    // extract template data from request body
    const { t_id, title, code, explanation, tags, language, isPublic } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    console.log(code);
    // update the template ensuring it belongs to the specified username
    const updatedTemplate = await prisma.template.update({
      where: {
        t_id,
        owner: username,
      },
      data: {
        title,
        code,
        explanation,
        public: isPublic,
        language,
        tags: {
          deleteMany: {}, // delete all existing tags
        },
      },
    });

    // add back tags
    const createdTags = await Promise.all(
      tags.map(async (tag: string) => {
        return await prisma.templateTag.create({
          data: {
            t_id: updatedTemplate.t_id,
            tag,
          },
        });
      })
    );

    return Response.json({ updatedTemplate }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    // handle specific Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return Response.json({ error: "template not found." }, { status: 404 }); // not found
      }
      return Response.json({ error: e.message }, { status: 400 }); // bad request for other validation issues
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      return Response.json({ error: "validation error: " + e.message }, { status: 422 }); // unprocessable entity
    } else {
      return Response.json({ error: "failed to update template" }, { status: 500 }); // internal server error
    }
    // note: portions of the above code were provided by ChatGPT
  }
}
