import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
  try {
    const { t_id, code, explanation, tags } = await req.json();
    // must make sure we are finding the right template selected (t_id)
    // since visitor, no need to check whether this is actually the visitor's fork

    const updatedTemplate = await prisma.template.update({
      where: {
        t_id,
      },
      data: {
        code,
        explanation,
        tags: {
          deleteMany: {}, // delete all tags
        }
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
      }
    ));

    return Response.json({ updatedTemplate }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to update template" }, { status: 500 });
  }
}