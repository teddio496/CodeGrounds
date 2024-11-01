import { prisma } from "@/utils/prismaClient";

export async function DELETE(req: Request) {
    try {
        const { c_id } = await req.json();

        if (!c_id) {
            return new Response(JSON.stringify({ error: "Comment ID (c_id) is required" }), { status: 400 });
        }
        await deleteCommentAndChildren(Number(c_id));

        return new Response(JSON.stringify({ message: "Comment and its children deleted successfully" }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to delete comment" }), { status: 500 });
    }
}

async function deleteCommentAndChildren(c_id: number) {
    const childComments = await prisma.comment.findMany({
        where: { parentId: c_id },
    });

    for (const child of childComments) {
        await deleteCommentAndChildren(child.c_id);
    }

    await prisma.comment.delete({
        where: { c_id },
    });
}
