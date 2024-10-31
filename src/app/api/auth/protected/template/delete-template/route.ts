import { prisma } from "@/utils/prismaClient";

export async function DELETE(req: Request) {
  try {
    const { t_id } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    // must make sure we are finding the right template selected (t_id)
    // and that this template belongs to `username`
    const template = await prisma.template.delete({
      where: {
        t_id,
        owner: username,
      },
    });

    return Response.json({ message: "deleted code template " + JSON.stringify(template) }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to delete template" }, { status: 500 });
  }
}