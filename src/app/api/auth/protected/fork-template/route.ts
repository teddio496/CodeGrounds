import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  const { title, code, explanation, forkedFrom } = await req.json();
  const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
  try {
    const fork = await prisma.codeTemplate.create({
      data: {
        title,
        code,
        explanation,
        username,
        forkedFrom,
      }
    });

    return Response.json({ forkedTemplate: fork, status: 201 });
  }
  catch (e) {
    console.log(e);
    return Response.json({ error: "failed to save code template" });
  }
}