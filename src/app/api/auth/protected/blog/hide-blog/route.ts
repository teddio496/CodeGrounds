import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
    try {
        const { b_id } = await req.json()
        const { username, role } = JSON.parse(req.headers.get("payload") as string) as { username: string, role: string };

        const checkAdminDb = await prisma.user.findUnique({ where : { username }})

        if (role !== 'Admin' || checkAdminDb?.role !== 'Admin') {
            return new Response(JSON.stringify({ error: "You don't have permissions to view reports" }), { status: 401 });
        }

        const check = await prisma.blogPost.findUnique({where: { b_id }});
        if (!check){
            return new Response(JSON.stringify({ error: "This blog is non-existent" }), { status: 400 });
        }
        if (check?.hidden){
            const updatedBlog = await prisma.blogPost.update({
                where :{ b_id },
                data: {
                    hidden: false
                }
            })
            return new Response(JSON.stringify({ message: "Successfully unhidden a blog!"}))
        }

        const updatedBlog = await prisma.blogPost.update({
            where :{ b_id },
            data: {
                hidden: true
            }
        })
        return new Response(JSON.stringify({ message: "Successfully hidden a blog!"}))

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to retrieve reports" }), { status: 500 });
    }
}
