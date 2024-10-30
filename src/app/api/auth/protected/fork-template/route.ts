import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  const { title, code, explanation, forkedFrom } = await req.json();
  const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
  try {
    const fork = await prisma.template.create({
      data: {
        owner: username,
        title,
        code,
        explanation,
        forkedFrom,
      }
    });

    return Response.json({ forkedTemplate: fork, status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to save code template" }, { status: 500 });
  }
}