import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
    try {
        const { c_id, explanation } = await req.json();
        const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };
        
        const check = await prisma.reportedComment.findUnique({ where: { c_id_username: { c_id, username } }})
        if (check) {
            return new Response(JSON.stringify({ message: "you have already reported this comment!" }), { status: 400 });
        }

        const newBlogReport= await prisma.reportedComment.create({
            data: {
                c_id, 
                username,
                explanation
            },
        });

        return new Response(JSON.stringify({ message: "successfully added a report" }), { status: 201 });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "failed to create new report" }), { status: 500 });
    }
}
   