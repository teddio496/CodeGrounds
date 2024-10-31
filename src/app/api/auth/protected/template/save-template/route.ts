import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  try {
    const { title, code, explanation, tags } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    
    const newTemplate = await prisma.template.create({
      data: {
        owner: username,
        title,
        code,
        explanation,
        tags: {
          create: tags.map((tag: string) => { tag: tag; })
        },
      }
    });

    return Response.json({ newTemplate }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to save code template" }, { status: 500 });
  }
}