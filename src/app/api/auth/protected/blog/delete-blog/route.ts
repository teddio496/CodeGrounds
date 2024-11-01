import { prisma } from "@/utils/prismaClient";

export async function DELETE(req: Request) {
    try {
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any }
        const { b_id } = await req.json();

        if (!b_id) {
            return Response.json({ error: "b_id is required" }, { status: 400 });
        }

        const getBlog = await prisma.blogPost.findUnique({where: {b_id}})
        
        if (!getBlog){
            return Response.json({ error: "no such blog exists" }, { status: 400 });
        }

        if (getBlog.authorName != username) {
            return Response.json({ error: "this is not your blog! lol" }, { status: 401 });
        }


        await prisma.blogPostTag.deleteMany({ where: { b_id } });
        await prisma.blogPost.delete({ where: { b_id } });
        return Response.json({ message: "successfully deleted the blog post" }, { status: 200 });

    } catch (e) {
        console.error(e);
        return Response.json({ error: "failed to delete the blog post" }, { status: 500 });
    }
}
