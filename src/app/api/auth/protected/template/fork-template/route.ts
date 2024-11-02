import { prisma } from "@/utils/prismaClient";
import { only } from "node:test";

// note: cannot just have one fork-template route
// the protected one needs to go through middleware to obtain payload and username
export async function POST(req: Request) {
  try {
    const { t_id, title } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    
    const forkingFrom: any = await prisma.template.findUnique({where: { t_id }})

    const yourTitles = await prisma.template.findMany({
      where : {
        owner:username
      },
      select: { title: true }
    })
    const onlyTitles = yourTitles.map((title) => title.title)
    if (yourTitles.includes(title) || (!title && onlyTitles.includes(forkingFrom.title))){
      return Response.json({ message: "Please change the title, you already have a template of this title." }, { status: 400 });
    }


    const { t_id: _ , ...withoutTid } = forkingFrom
    const fork = await prisma.template.create({
      data: {
        ...withoutTid,
        title: title ? title : forkingFrom.title,
        owner: username,
        forkedFrom: t_id,
      }
    });

    return Response.json({ fork }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to fork template" }, { status: 500 });
  }
}