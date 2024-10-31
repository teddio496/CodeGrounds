import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  try {
    const { title, code, explanation, forkedFrom } = await req.json();

    const fork = await prisma.template.create({
      data: {
        owner: "Anonymous Visitor",
        title,
        code,
        explanation,
        forkedFrom,
      }
    });

    return Response.json({ fork }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to fork template" }, { status: 500 });
  }
}