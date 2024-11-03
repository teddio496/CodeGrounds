import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
    try {
        const { c_id, isUp } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string };

        const existingVote = await prisma.commentUpDownVotes.findUnique({
            where: {
                username_c_id: { username, c_id },
            },
        });

        if (existingVote) {
            if (existingVote.isUp === isUp) {
                // If the existing vote matches the request, remove the vote
                await prisma.commentUpDownVotes.delete({
                    where: {
                        username_c_id: { username, c_id },
                    },
                });
                await prisma.comment.update({
                    where: { c_id },
                    data: isUp
                        ? { upvotes: { decrement: 1 } }
                        : { downvotes: { decrement: 1 } },
                });
            } else {
                // Switch the vote if the current vote is different from the request
                await prisma.commentUpDownVotes.update({
                    where: {
                        username_c_id: { username, c_id },
                    },
                    data: { isUp },
                });
                await prisma.comment.update({
                    where: { c_id },
                    data: isUp
                        ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
                        : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
                });
            }
        } else {
            // No existing vote, so create a new one
            await prisma.commentUpDownVotes.create({
                data: { c_id, username, isUp },
            });
            await prisma.comment.update({
                where: { c_id },
                data: isUp
                    ? { upvotes: { increment: 1 } }
                    : { downvotes: { increment: 1 } },
            });
        }

        return new Response(JSON.stringify({ message: "Vote updated successfully" }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Something went wrong with voting" }), { status: 500 });
    }
}
