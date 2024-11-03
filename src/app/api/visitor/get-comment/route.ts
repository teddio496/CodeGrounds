import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const postId = url.searchParams.get("postId") ? Number(url.searchParams.get("postId")) : null;
        const page = url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1;
        const pageSize = url.searchParams.get("pageSize") ? Number(url.searchParams.get("pageSize")) : 10;
        const most_value = url.searchParams.get("most_value") || "";
        const most_controversial = url.searchParams.get("most_controversial") || "";
        
        if (!postId) {
            return new Response(JSON.stringify({ error: "postId is required" }), { status: 400 });
        }

        const allComments = await fetchComments(postId, null);
        if (most_value && most_controversial){
            return new Response(JSON.stringify({ error: "You cannot sort by two different criterion." }), { status: 400 });
        }

        if (most_value){
            allComments.sort((a: any, b: any) => (b.upvotes - b.downvotes)- (a.upvotes - a.downvotes));
        }
        
        if (most_controversial){
            allComments.sort((a: any, b: any) => (b.upvotes + b.downvotes)/Math.max(1, Math.abs(b.upvotes - b.downvotes)) - (a.upvotes + a.downvotes)/Math.max(1, Math.abs(a.upvotes - a.downvotes)));
        }

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
