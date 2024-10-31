import { prisma } from "@/utils/prismaClient";

export default async function DELETE(req: Request) {
    try {
        const { b_id } = await req.json();
        if (!b_id) {
            return Response.json({ error: "b_id is required" }, { status: 400 });
        }
        
        await prisma.blogPost.delete({ where: { b_id } });
        return Response.json({ message: "successfully deleted the blog post" }, { status: 200 });

    } catch (e) {
        console.error(e);
        return Response.json({ error: "failed to delete the blog post" }, { status: 500 });
    }
}
