import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  const { title, code, explanation, tags } = await req.json();
  const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
  try {
    const template = await prisma.codeTemplate.create({
      data: {
        title: title,
        code: code,
        explanation: explanation,
        tags: {
          create: tags.map((tag: string) => { tag: tag; })
        },
        username: username, // establishes connection to user
      }
    });

    return Response.json({ template: template, status: 201 });
  }
  catch (e) {
    console.log(e);
    return Response.json({ error: "failed to save code template" });
  }
}