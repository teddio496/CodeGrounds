import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// search through all templates in the system with pagination
export async function POST(req: NextRequest) {
  try {
    const { title, explanation, code, tags, page = 1, pageSize = 10 } = await req.json();
    const offset = (page - 1) * pageSize;
    // title, explanation, code could be "" and tags could be [], test if works

    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
        ],
        tags: {
          every: {
            title: {
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

    // get number of all matching templates
    const totalTemplates = await prisma.template.count({
      where: {
        OR: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
        ],
        tags: {
          every: {
            title: {
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
