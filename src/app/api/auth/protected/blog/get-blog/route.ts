import { prisma } from "@/utils/prismaClient";

export default async function GET(req: Request) {
    try {
        const { b_id } = await req.json();
        const blogPost = await prisma.blogPost.findUnique({
            where: { b_id },
            include: { tags: true },
        });

        if (!blogPost) {
            return new Response(JSON.stringify({ error: "Blog post not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(blogPost), { status: 200 });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to retrieve blog post" }), { status: 500 });
    }
}