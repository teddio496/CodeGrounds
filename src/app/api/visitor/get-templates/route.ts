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
    const tags = url.searchParams.getAll("tags");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const author = url.searchParams.get("author") || "";
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const offset = (page - 1) * pageSize;

    const t_id = parseInt(url.searchParams.get("t_id") || "-1", 10);

    if (t_id >= 0) {
      const template = await prisma.template.findUnique({
        where: { t_id },
        include: { tags: true, user: true, blogs: true },
      });
      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }
      return NextResponse.json({ templates: template }, { status: 200 });
    }

    // Step 1: Filter templates by fields
    const templatesByFields = await prisma.template.findMany({
      where: {
        AND: [
          { title: { contains: title } },
          { explanation: { contains: explanation } },
          { code: { contains: code } },
          { owner: { contains: author } },
        ],
      },
      select: { t_id: true },
    });
    const templateIdsByFields = templatesByFields.map((template) => template.t_id);

    // Step 2: Filter templates by tags
    const templatesByTags = tags.length === 0
      ? []
      : await prisma.template.findMany({
          where: {
            tags: {
              some: {
                tag: {
                  in: tags,
                },
              },
            },
          },
          select: { t_id: true },
        });
    const templateIdsByTags = tags.length === 0
      ? templateIdsByFields
      : templatesByTags.map((template) => template.t_id);

    // Step 3: Calculate intersected template IDs
    const intersectedTemplateIds = templateIdsByFields.filter((id) =>
      templateIdsByTags.includes(id)
    );

    // Step 4: Fetch paginated templates
    const templates = await prisma.template.findMany({
      where: {
        t_id: { in: intersectedTemplateIds },
      },
      include: {
        tags: true,
        blogs: {
          select: {
            b_id: true,
            title: true,
            description: true,
            authorName: true,
            createdAt: true,
            upvotes: true,
            downvotes: true,
          },
        },
        user: true,
      },
      skip: offset,
      take: pageSize,
    });

    // Step 5: Count total templates for pagination
    const totalTemplates = intersectedTemplateIds.length;
    const totalPages = Math.ceil(totalTemplates / pageSize);

    return NextResponse.json(
      { templates, totalTemplates, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching templates:", error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Known request error occurred while searching templates" },
        { status: 400 }
      );
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Validation error occurred while searching templates" },
        { status: 422 }
      );
    }
    // Catch-all for other errors
    return NextResponse.json(
      { error: "Failed to search templates" },
      { status: 500 }
    );
  }
}
