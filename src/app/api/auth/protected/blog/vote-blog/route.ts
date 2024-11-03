import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
    try {
        const { b_id, isUp } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string };

        const existingVote = await prisma.upDownVotes.findUnique({
            where: {
                username_b_id: { username, b_id },
            },
        });

        if (existingVote) {
            if (existingVote.isUp === isUp) {
                await prisma.upDownVotes.delete({
                    where: {
                        username_b_id: { username, b_id },
                    },
                });
                await prisma.blogPost.update({
                    where: { b_id },
                    data: isUp
                        ? { upvotes: { decrement: 1 } }
                        : { downvotes: { decrement: 1 } },
                });
            } else {
                await prisma.upDownVotes.update({
                    where: {
                        username_b_id: { username, b_id },
                    },
                    data: { isUp },
                });
                await prisma.blogPost.update({
                    where: { b_id },
                    data: isUp
                        ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
                        : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
                });
            }
        } else {
            await prisma.upDownVotes.create({
                data: { b_id, username, isUp },
            });
            await prisma.blogPost.update({
                where: { b_id },
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
