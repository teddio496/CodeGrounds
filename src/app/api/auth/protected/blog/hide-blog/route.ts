import { prisma } from "@/utils/prismaClient";

export async function POST(req: Request) {
    try {
        const { b_id } = await req.json()
        const { role } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };
        if (role != 'Admin'){
            return new Response(JSON.stringify({ error: "You dont have the permissions to hide/unhide reports" }), { status: 401 });
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
