import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
  console.log("REACHED SAVE TEMPLATE");
  try {
    const { title, code, explanation, tags, language } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const newTemplate = await prisma.template.create({
      data: {
        owner: username,
        title,
        code,
        explanation,
        language,
      }
    });

    // these tags will automatically be attached to the new template by our constraint
    const createdTags = await Promise.all(
      tags.map(async (tag: string) => {
        return await prisma.templateTag.create({
          data: {
            t_id: newTemplate.t_id,
            tag,
          },
        });
      }
    ));

    console.log(newTemplate);
    return Response.json({ newTemplate }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "failed to save code template" }, { status: 500 });
  }
}