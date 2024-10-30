import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
  const { title, code, explanation, tags } = await req.json();
  const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
  try {
    const template = await prisma.template.update({
      where: {
        owner: username,
        title,
      },
      data: {
        code: code,
        explanation: explanation,
        tags: {
          deleteMany: {},
          // creating multiple related records
          // ref: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#create-a-related-record
          // this strategy covers 3 potential cases: add, delete, and update tags
          create: tags.map((tag: string) => { tag: tag; })
        }
      }
    });

    return Response.json({ message: "deleted code template " + JSON.stringify(template) }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to save code template" }, { status: 500 });
  }
}