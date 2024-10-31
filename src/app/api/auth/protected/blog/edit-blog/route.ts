import { prisma } from "@/utils/prismaClient";

export default async function POST(req: Request) {
    try {
        const { b_id, title, description, tags, content } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };
        
        const updatedBlogPost = await prisma.blogPost.update({
            where: { b_id },
            data: {
                title,
                description,
                content, 
                authorName: username,
                tags: {
                    create: tags.map((tag: string) => ({ tag }))
                }
            }
        });

        return Response.json({ message: "successfully updated the blog" }, { status: 200 });

    } catch (e) {
        console.error(e);
        return Response.json({ error: "failed to update the blog post" }, { status: 500 });
    }
}