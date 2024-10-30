import { prisma } from "@/utils/prismaClient";

export async function DELETE(req: Request) {
  const { title } = await req.json();
  const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
  try {
    const template = await prisma.template.delete({
      where: {
        owner: username,
        title,
      },
    });

    return Response.json({ message: "deleted code template " + JSON.stringify(template) }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to save code template" }, { status: 500 });
  }
}