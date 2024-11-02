import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";

export async function DELETE(req: Request) {
  try {
    // extract template ID from request body
    const { t_id } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    // attempt to delete the specified template ensuring it belongs to the specified username
    const template = await prisma.template.delete({
      where: {
        t_id,
        owner: username,
      },
    });

    return Response.json({ message: "deleted code template " + JSON.stringify(template) }, { status: 200 });
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
      return Response.json({ error: "failed to delete template" }, { status: 500 }); // internal server error
    }
  }
}
