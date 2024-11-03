import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";
import { stat } from "fs";

export async function DELETE(req: Request) {
  try {
    // extract template ID from request body
    const { t_id } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const template = await prisma.template.findUnique({
      where: { t_id },
      include: {
        children: true,
      }
    });

    if (template?.owner !== username) {
      return Response.json({ error: "not allowed to delete template that is not yours" }, { status: 403 });
    }

    const thing = await prisma.template.updateMany({
      where: {
        t_id: {
          in: template?.children.map((child) => child.t_id)
        }
      },
      data: {
        forkedFrom: null
      }
    });

    await prisma.templateTag.deleteMany({
      where: { t_id }
    });

    // attempt to delete the specified template ensuring it belongs to the specified username
    const deleted = await prisma.template.delete({
      where: {
        t_id,
      },
    });

    return Response.json({ message: "deleted code template " + JSON.stringify(deleted) }, { status: 200 });
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
    // note: portions of the above code were provided by ChatGPT
  }
}
