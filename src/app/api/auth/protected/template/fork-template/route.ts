import { prisma } from "@/utils/prismaClient";

// note: cannot just have one fork-template route
// the protected one needs to go through middleware to obtain payload and username
export async function POST(req: Request) {
  try {
    const { title, code, explanation, forkedFrom } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const fork = await prisma.template.create({
      data: {
        owner: username,
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