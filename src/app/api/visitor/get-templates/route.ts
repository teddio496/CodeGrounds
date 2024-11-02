import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

// Search through all templates in the system with pagination
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get("title") || "";
    const explanation = url.searchParams.get("explanation") || "";
    const code = url.searchParams.get("code") || "";
    const tags = url.searchParams.getAll("tags") || [];
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    const offset = (page - 1) * pageSize;

    const templates = await prisma.template.findMany({
      where: {
        AND: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
        ],
      },
      include: {
        tags: true,
        blogs: {
          where: { hidden: false },
          select: { 
            b_id: true,
            title: true,
            description: true,
            content: false,
            authorName: true,
            createdAt: true,
            upvotes: true,
            downvotes: true
          }
        }
      },
      skip: offset,
      take: pageSize,
    });
    console.log(tags)
    const templatesByTag = tags.length == 0 ? templates :  await prisma.template.findMany({
      where: {
        public: true,
        tags: {
          some: {
            tag: {
              in: tags,
            },
          },
        },
      },
    });
    console.log(templates)
    console.log(templatesByTag)

    const interesectedTemplates = templates.filter((template) => {
      for (const tagTemplate of templatesByTag){
        if (tagTemplate.t_id == template.t_id){
          return true
        }
      }
      return false
    })

    // Get number of all matching templates
    const totalTemplates = await prisma.template.count({
      where: {
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

    // Calculate total pages
    const totalPages = Math.ceil(totalTemplates / pageSize);

    return NextResponse.json(
      { templates: interesectedTemplates, totalTemplates, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching templates:", error);
    return NextResponse.json(
      { error: "Failed to search templates" },
      { status: 500 }
    );
  }
}
