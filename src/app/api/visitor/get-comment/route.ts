import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
    try {
        const params = Object.fromEntries(new URL(req.url).searchParams);
        const postId = params.postId ? Number(params.postId) : null;
        const page = params.page ? Number(params.page) : 1;
        const pageSize = params.pageSize ? Number(params.pageSize) : 10;

        if (!postId) {
            return new Response(JSON.stringify({ error: "postId is required" }), { status: 400 });
        }

        const allComments = await fetchComments(postId, null);

        // Apply pagination to the final comments array
        const paginatedComments = allComments.slice((page - 1) * pageSize, page * pageSize);

        return new Response(JSON.stringify(paginatedComments), { status: 200 });
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
