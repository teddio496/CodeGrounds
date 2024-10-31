import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// gets all the user's templates, doesn't search through all templates in system
export async function POST(req: NextRequest) {
  try {
    const { title, explanation, code, tags, page = 1, pageSize = 10 } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
    const offset = (page - 1) * pageSize;
    // title, explanation, code could be "" and tags could be [], test if works

    const templates = await prisma.template.findMany({
      where: {
        owner: username,
        OR: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
        ],
        tags: {
          every: {
            tag: {
              in: tags,
            },
          },
        },
      },
      include: {
        tags: true,
      },
      skip: offset,  
      take: pageSize,
    });

    // get number of all matching templates owned by user
    const totalTemplates = await prisma.template.count({
      where: {
        owner: username,
        OR: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
        ],
        tags: {
          every: {
            tag: {
              in: tags,
            },
          },
        },
      },
    });

    // calculate total pages
    const totalPages = Math.ceil(totalTemplates / pageSize);

    return NextResponse.json({ templates, totalTemplates, totalPages, currentPage: page }, { status: 200 });
  } catch (error) {
    console.error("Error searching templates:", error);
    return NextResponse.json({ error: "Failed to search templates" }, { status: 500 });
  }
}