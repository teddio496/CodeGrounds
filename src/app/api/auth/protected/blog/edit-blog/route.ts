import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
    try {
        const { b_id, title, description, tags, content, codeTemplates } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };

        const checkIfHidden = await prisma.blogPost.findUnique({
            where: { b_id }
        })
        if (checkIfHidden?.hidden) {
            return new Response(JSON.stringify({ message: "This content is hidden by the Admin, you may not edit this blog!" }), { status: 401 });
        }

        await prisma.blogPostTag.deleteMany({
            where: { b_id },
        });


        const updatedBlogPost = await prisma.blogPost.update({
            where: { b_id },
            data: {
                title,
                description,
                content,
                authorName: username,
                tags: {
                    create: tags.map((tag: string) => ({ tag })),
                },
                templates: {
                    set: [],
                    connect: codeTemplates.map((templateId: number) => ({ t_id: templateId })),
                },
            },
        });

        return new Response(JSON.stringify({ message: "successfully updated the blog" }), { status: 200 });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "failed to update the blog post" }), { status: 500 });
    }
}
