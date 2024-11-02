import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
  try {
    const { t_id, title, code, explanation, tags, isPublic } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    // must make sure we are finding the right template selected (t_id)
    // and that this template belongs to `username`
    const updatedTemplate = await prisma.template.update({
      where: {
        t_id,
        owner: username,
      },
      data: {
        title,
        code,
        explanation,
        tags: {
          deleteMany: {}, // delete all tags
        },
        public: isPublic
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