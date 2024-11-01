import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
    try {

        const { role } = JSON.parse(req.headers.get("payload") as string) as { username: string; [key: string]: any };
        if (role != 'Admin'){
            return new Response(JSON.stringify({ error: "You dont have the permissions to view reports" }), { status: 401 });
        }

        const reportedBlogs = await prisma.reportedBlog.findMany({
            include: {
                BlogPost: {
                    select: { title: true, authorName: true },
                },
                User: {
                    select: { username: true },
                },
            },
        });

        const blogReports = reportedBlogs.map((report) => ({
            type: "Blog Report",
            reportId: report.b_id,
            reportedBy: report.User.username,
            reportDetails: {
                title: report.BlogPost.title,
                author: report.BlogPost.authorName,
            },
        }));

        const reportedComments = await prisma.reportedComment.findMany({
            include: {
                Comment: {
                    select: { content: true, authorName: true },
                },
                User: {
                    select: { username: true },
                },
            },
        });

        const commentReports = reportedComments.map((report) => ({
            type: "Comment Report",
            reportId: report.c_id,
            reportedBy: report.User.username,
            reportDetails: {
                content: report.Comment.content,
                author: report.Comment.authorName,
            },
        }));

        const combinedReports = [...blogReports, ...commentReports];

        return new Response(JSON.stringify(combinedReports), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to retrieve reports" }), { status: 500 });
    }
}
