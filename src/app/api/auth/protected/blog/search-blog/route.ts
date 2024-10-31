import { prisma } from "@/utils/prismaClient";

export default async function GET(req: Request) {
    try {
        const { title, description, tags, content } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };
        
        const newBlogPost = prisma.blogPost.create({
            data: {
                title,
                description,
                content, 
                authorName: username,
                tags: {
                    create: tags.map((tag: string) => { tag: tag })
                }
            }
        });

        return Response.json({message: "successfully added a blog"}, {status: 201});

    } catch (e) {
        console.error(e);
        return Response.json({ error: "failed to create new blog post" }, { status: 500 });
    }
}