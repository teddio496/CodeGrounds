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
    const authorName = url.searchParams.get("author") || "";
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const most_value = url.searchParams.get("most_value") || "";
    const most_controversial = url.searchParams.get("most_controversial") || "";
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
          { authorName : { contains: authorName }},
          { hidden : false }
        ],
      },
      select: { b_id: true },
    });
    const blogPostIdsByFields = blogPostsByFields.map((post) => post.b_id);
    
    const blogPostsByTemplates = await prisma.blogPost.findMany({
      where: {
        templates: {
          some: {
            OR: codeTemplates.map((template) => ({
              t_id: parseInt(template, 10),
            })),
          },
        },
      },
      select: { b_id: true },
    });
    console.log(codeTemplates)
    console.log(blogPostsByTemplates)
    const blogPostIdsByTemplates = codeTemplates.length != 0 ? blogPostsByTemplates.map((post) => post.b_id) : blogPostIdsByFields;

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


    const blogPostIdsByTags = tags.length != 0 ? blogPostsByTags.map((post: any) => post.b_id) : blogPostIdsByFields;
    const intersectedBlogPostIds = blogPostIdsByFields
      .filter((id: any) => blogPostIdsByTemplates.includes(id))
      .filter((id: any) => blogPostIdsByTags.includes(id));

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
    if (most_value && most_controversial){
      return new Response(JSON.stringify({ error: "You cannot sort by two different criterion." }), { status: 400 });
  }
    if (most_value){
      blogPosts.sort((a: any, b: any) =>  (b.upvotes - b.downvotes)- (a.upvotes - a.downvotes));
    }
    if (most_controversial){
      blogPosts.sort((a: any, b: any) =>  (b.upvotes + b.downvotes)/Math.max(1, Math.abs(b.upvotes - b.downvotes)) - (a.upvotes + a.downvotes)/Math.max(1, Math.abs(a.upvotes - a.downvotes)));
    }


    const totalBlogPosts = intersectedBlogPostIds.length;
    const totalPages = Math.ceil(totalBlogPosts / pageSize);

    return NextResponse.json({ blogPosts, totalBlogPosts, totalPages, currentPage: page }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
