import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
  try {
    const { t_id, code, explanation, tags } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    
    // must make sure we are finding the right template selected (t_id)
    // and that this template belongs to `username`
    const updatedTemplate = await prisma.template.update({
      where: {
        t_id,
        owner: username,
      },
      data: {
        code,
        explanation,
        tags: {
          deleteMany: {},
          // creating multiple related records
          // ref: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#create-a-related-record
          // this strategy covers 3 potential cases: add, delete, and update tags
          create: tags.map((tag: string) => { tag: tag; })
        }
      }
    });

    return Response.json({ updatedTemplate }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to update template" }, { status: 500 });
  }
}