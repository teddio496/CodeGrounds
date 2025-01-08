import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const b_id = searchParams.get("b_id");
        const username = JSON.parse(req.headers.get("payload") as string).username;

        if (!b_id || !username) {
            return new Response(
                JSON.stringify({ error: "Missing blog ID or user information" }),
                { status: 400 }
            );
        }

        const vote = await prisma.upDownVotes.findUnique({
            where: {
                username_b_id: { username, b_id:~~b_id },
            },
        });

        return new Response(
            JSON.stringify({
                voteStatus: vote ? (vote.isUp ? "upvote" : "downvote") : "none",
            }),
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return new Response(
            JSON.stringify({ error: "Something went wrong while checking the vote" }),
            { status: 500 }
        );
    }
}
