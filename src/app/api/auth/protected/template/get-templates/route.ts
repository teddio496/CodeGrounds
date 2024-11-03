import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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
    const sort_by_date = url.searchParams.get("sort_by_date") || false;
    const offset = (page - 1) * pageSize;
    const t_id =  parseInt(url.searchParams.get("t_id") || "-1", 10);

    if (t_id >= 0){
      const template = await prisma.template.findUnique({ where: { t_id }, include: {tags: true, user: true,} });
      return NextResponse.json( template, { status: 200 } );
    }
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const templates = await prisma.template.findMany({
      where: {
        owner: username,
        AND: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
        ],
      },
      include: {
        tags: true,
        blogs: {
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
        },
        user: true
      },
      skip: offset,
      take: pageSize,
    });

    const templatesByTag = tags.length == 0 ? templates : await prisma.template.findMany({
      where: {
        tags: {
          some: {
            tag: {
              in: tags,
            },
          },
        },
      },
      include: {
        tags: true
      }
    });

    const interesectedTemplates = templates.filter((template) => {
      for (const tagTemplate of templatesByTag) {
        if (tagTemplate.t_id == template.t_id) {
          return true;
        }
      }
      return false;
    });

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

    if (sort_by_date) {
      interesectedTemplates.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalTemplates / pageSize);

    return NextResponse.json(
      { templates: interesectedTemplates, totalTemplates, totalPages, currentPage: page },
      { status: 200 }
    );
  }
  catch (error) {
    console.error("error searching templates:", error);

    // handle specific prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "known request error occurred while searching templates" },
        { status: 400 } // or another appropriate status
      );
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "validation error occurred while searching templates" },
        { status: 422 } // unprocessable entity
      );
    }
    // handle other possible errors (e.g., malformed url)
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: "invalid input or request format" },
        { status: 400 }
      );
    }
    // catch-all for any other errors
    return NextResponse.json(
      { error: "failed to search templates" },
      { status: 500 }
    );
    // note: portions of the above code were provided by ChatGPT
  }
}
