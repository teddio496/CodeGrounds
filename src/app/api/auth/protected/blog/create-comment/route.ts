import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
    try {
        const { content, postId, parentId } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };

        const newComment = await prisma.comment.create({
            data: {
            content,
            postId,
            authorName: username,
            ...(parentId && { parentId }) 
            },
        });
        
        return new Response(JSON.stringify({ message: "successfully added a comment", c_id: newComment.c_id }), { status: 201 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "failed to create new comment" }), { status: 400 });
    }
}
   