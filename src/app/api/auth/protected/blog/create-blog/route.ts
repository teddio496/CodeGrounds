import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
    try {
        const { title, description, tags, content, codeTemplates } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };

        // Create the new blog post and connect tags and codeTemplates
        const newBlogPost = await prisma.blogPost.create({
            data: {
                title,
                description,
                content,
                authorName: username,
                tags: {
                    create: tags.map((tag: string) => ({ tag })),
                },
                templates: {
                    connect: codeTemplates.map((templateId: number) => ({ t_id: templateId })),
                },
            },
        });

        return new Response(JSON.stringify({ message: "successfully added a blog" }), { status: 201 });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "failed to create new blog post" }), { status: 500 });
    }
}
   