import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
    try {
        const { postId } = Object.fromEntries(new URL(req.url).searchParams);

        if (!postId) {
            return new Response(JSON.stringify({ error: "postId is required" }), { status: 400 });
        }

        const comments = await fetchComments(Number(postId), null);

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to retrieve comments" }), { status: 500 });
    }
}

async function fetchComments(postId: number, parentId: number | null): Promise<any[]> {
    const comments = await prisma.comment.findMany({
        where: { postId, parentId },
        include: {
            user: {
                select: { username: true, avatar: true },
            },
            children: true
        },
        orderBy: { createdAt: 'asc' },
    });

    for (const comment of comments) {
        comment.children = await fetchComments(postId, comment.c_id);
    }

    return comments;
}
