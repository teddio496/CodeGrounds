import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
    try {
        const { username, role } = JSON.parse(req.headers.get("payload") as string) as { username: string, role: string };

        const checkAdminDb = await prisma.user.findUnique({ where : { username }})
        // console.log(role)
        // console.log(checkAdminDb)
        
        if (role !== 'Admin' || checkAdminDb?.role !== 'Admin') {
            return new Response(JSON.stringify({ error: "You don't have permissions to view reports" }), { status: 401 });
        }

        const url = new URL(req.url);
        const sort_by = url.searchParams.get("sort_by") || "desc";
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const pageSize = parseInt(url.searchParams.get("page_size") || "10", 10);
        const skip = (page - 1) * pageSize;

        const blogReports = await prisma.reportedBlog.groupBy({
            by: ['b_id'],
            _count: { username: true },
            orderBy: {
                _count: { username: sort_by === "asc" ? "asc" : "desc" },
            },
            skip,
            take: pageSize,
        });

        const blogReportsDetails = await Promise.all(blogReports.map(async (report) => {
            const reportDetails = await prisma.reportedBlog.findMany({
                where: { b_id: report.b_id },
                include: {
                    BlogPost: {
                        select: { title: true, authorName: true },
                    },
                },
            });
            return {
                type: "Blog Report",
                reportId: report.b_id,
                reportCount: report._count.username,
                reportDetails: reportDetails,
            };
        }));

        const commentReports = await prisma.reportedComment.groupBy({
            by: ['c_id'],
            _count: { username: true },
            orderBy: {
                _count: { username: sort_by === "asc" ? "asc" : "desc" },
            },
            skip,
            take: pageSize,
        });

        const commentReportsDetails = await Promise.all(commentReports.map(async (report) => {
            const reportDetails = await prisma.reportedComment.findMany({
                where: { c_id: report.c_id },
                include: {
                    Comment: {
                        select: { content: true, authorName: true },
                    },
                },
            });
            return {
                type: "Comment Report",
                reportId: report.c_id,
                reportCount: report._count.username,
                reportDetails: reportDetails,
            };
        }));

        const combinedReports = [...blogReportsDetails, ...commentReportsDetails];

        return new Response(JSON.stringify(combinedReports), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to retrieve reports" }), { status: 500 });
    }
}
