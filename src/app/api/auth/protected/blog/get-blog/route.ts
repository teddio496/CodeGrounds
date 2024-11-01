import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get("title") || "";
    const b_id = parseInt(url.searchParams.get("b_id") || "", 10) || -1;
    const content = url.searchParams.get("content") || "";
    const description = url.searchParams.get("description") || "";
    const tags = url.searchParams.getAll("tags");
    const codeTemplates = url.searchParams.getAll("codeTemplates");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const offset = (page - 1) * pageSize;

    if (b_id != -1){
        const blogPost = await prisma.blogPost.findUnique({
            where: { b_id },
            include: { tags: true, templates: true },
        });

        if (!blogPost) {
            return new Response(JSON.stringify({ error: "Blog post not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(blogPost), { status: 200 });

    }

    const blogPostsByFields = await prisma.blogPost.findMany({
      where: {
        AND: [
          { title: { contains: title } },
          { content: { contains: content } },
          { description: { contains: description } },
        ],
      },
      select: { b_id: true },
    });

    console.log(blogPostsByFields)

    const blogPostIdsByFields = blogPostsByFields.map((post) => post.b_id);
    console.log(blogPostIdsByFields)
    const blogPostsByTemplates = await prisma.blogPost.findMany({
      where: {
        templates: {
          some: {
            OR: codeTemplates.map((template) => ({
              title: { contains: template },
            })),
          },
        },
      },
      select: { b_id: true },
    });

    console.log(blogPostsByTemplates)

    const blogPostIdsByTemplates = codeTemplates.length != 0 ? blogPostsByTemplates.map((post) => post.b_id) : blogPostIdsByFields;
    console.log(blogPostIdsByTemplates)

    const blogPostsByTags = await prisma.blogPost.findMany({
      where: {
        tags: {
          some: {
            tag: {
              in: tags,
            },
          },
        },
      },
      select: { b_id: true },
    });
    console.log(blogPostsByTags)
    const blogPostIdsByTags = tags.length != 0 ? blogPostsByTags.map((post) => post.b_id) : blogPostIdsByFields;
    console.log(blogPostIdsByTags)
    const intersectedBlogPostIds = blogPostIdsByFields
      .filter((id) => blogPostIdsByTemplates.includes(id))
      .filter((id) => blogPostIdsByTags.includes(id));

    console.log(intersectedBlogPostIds)
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        b_id: { in: intersectedBlogPostIds },
      },
      include: {
        tags: true,
        templates: true,
      },
      skip: offset,
      take: pageSize,
    });

    const totalBlogPosts = intersectedBlogPostIds.length;
    const totalPages = Math.ceil(totalBlogPosts / pageSize);

    return NextResponse.json({ blogPosts, totalBlogPosts, totalPages, currentPage: page }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
