import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
    try {
        const { c_id } = await req.json()
        const { username, role } = JSON.parse(req.headers.get("payload") as string) as { username: string, role: string };

        const checkAdminDb = await prisma.user.findUnique({ where : { username }})

        if (role !== 'Admin' || checkAdminDb?.role !== 'Admin') {
            return new Response(JSON.stringify({ error: "You don't have permissions to view reports" }), { status: 401 });
        }

        const check = await prisma.comment.findUnique({where: { c_id: ~~c_id }});

        if (!check){
            return new Response(JSON.stringify({ error: "This Comment is non-existent" }), { status: 400 });
        }
        if (check?.hidden){
            const updatedComment = await prisma.comment.update({
                where :{ c_id },
                data: {
                    hidden: false
                }
            })
            return new Response(JSON.stringify({ message: "Successfully unhidden a Comment!"}))
        }

        const updatedComment = await prisma.comment.update({
            where :{ c_id },
            data: {
                hidden: true
            }
        })
        return new Response(JSON.stringify({ message: "Successfully hidden a Comment!"}))

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to retrieve reports" }), { status: 500 });
    }
}
