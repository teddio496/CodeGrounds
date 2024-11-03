"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/app/components/ui/table";
import { Button } from "@/src/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/src/app/components/ui/pagination";
import { Checkbox } from "@/src/app/components/ui/checkbox"; // Assume a Checkbox component exists
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface ReportDetails {
    explanation: string;
    createdAt: string;
    BlogPost?: {
        title: string;
        authorName: string;
        b_id: number;
        hidden: Boolean;
    };
    Comment?: {
        content: string;
        authorName: string;
        hidden: Boolean;
    };
}

interface Report {
    type: "Blog Report" | "Comment Report";
    reportId: number;
    reportCount: number;
    reportDetails: ReportDetails[];
}

const ReportsPage = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(10);
    const [showOnlyUnhidden, setShowOnlyUnhidden] = useState(false);
    const [showOnlyComments, setShowOnlyComments] = useState(false);
    const [showOnlyBlogs, setShowOnlyBlogs] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true); // Set loading to true while fetching data
            const res = await fetch("/api/auth/protected/profile/get-user", {
              method: "GET",
              credentials: "include",
            });
        
            if (res.ok) {
              const data = await res.json();
              if (data.user.role !== "Admin"){
                toast("You are not allowed to access thia page!")
                router.push('/')
              }
            } else {
                toast("You are not allowed to access thia page!")
                router.push('/')
            }
        };
        fetchUserData();
    }, [])


    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                sort_by: sortBy,
                page: page.toString(),
                page_size: pageSize.toString(),
                ...(showOnlyUnhidden && { unhidden: "true" }),
                ...(showOnlyComments && { type: "comment" }),
                ...(showOnlyBlogs && { type: "blog" }),
            });
            const response = await fetch(`/api/auth/protected/blog/view-report?${params}`);
            if (response.ok) {
                const data: Report[] = await response.json();
                setReports(data);
            } else {
                console.error("Error fetching reports:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleHide = async (b_id: number, type: string) => {
        const idKey = type.includes("Comment") ? "c_id" : "b_id";
        const endpoint = `/api/auth/protected/blog/hide-${type.split(" ")[0].toLowerCase()}`;

        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [idKey]: b_id }),
            });

            if (!response.ok) {
                console.error("Failed to hide item:", response.statusText);
            }
            fetchReports();
        } catch (error) {
            console.error("Error hiding item:", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [sortBy, page, pageSize, showOnlyUnhidden, showOnlyComments, showOnlyBlogs]);

    return (
        <div className="container mx-auto p-4 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Reported Blogs/Comments</h1>
            <div className="flex items-center justify-between mb-4">
                <Select onValueChange={(value) => setSortBy(value as "asc" | "desc")} defaultValue={sortBy}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-4">
                <Checkbox
                    id="show-unhidden"
                    checked={showOnlyUnhidden}
                    onCheckedChange={(value: boolean) => setShowOnlyUnhidden(value)}
                />
                <label htmlFor="show-unhidden">Show only unhidden</label>
                <Checkbox
                    id="show-comments"
                    checked={showOnlyComments}
                    onCheckedChange={(value: boolean) => setShowOnlyComments(value)}
                    disabled={showOnlyBlogs} // Disable to avoid conflicting filters
                />
                <label htmlFor="show-comments">Show only comments</label>
                <Checkbox
                    id="show-blogs"
                    checked={showOnlyBlogs}
                    onCheckedChange={(value: boolean) => setShowOnlyBlogs(value)}
                    disabled={showOnlyComments} // Disable to avoid conflicting filters
                />
                <label htmlFor="show-blogs">Show only blogs</label>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Report Count</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Hide</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : reports.length > 0 ? (
                        reports.map((report) => (
                            <TableRow key={report.reportId}>
                                <TableCell>{report.type}</TableCell>
                                <TableCell>{report.reportId}</TableCell>
                                <TableCell>{report.reportCount}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() =>
                                            alert(
                                                JSON.stringify(report.reportDetails, null, 2)
                                            )
                                        }
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleHide(report.reportId, report.type)}>
                                        {report.type === "Blog Report"
                                            ? report.reportDetails[0].BlogPost?.hidden
                                                ? "Unhide"
                                                : "Hide"
                                            : report.reportDetails[0].Comment?.hidden
                                            ? "Unhide"
                                            : "Hide"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No reports found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) setPage(page - 1);
                            }}
                        />
                    </PaginationItem>
                    {Array.from(
                        { length: Math.ceil(reports.length / pageSize) || 1 },
                        (_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(index + 1);
                                    }}
                                    className={page === index + 1 ? "active" : ""}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < Math.ceil(reports.length / pageSize)) setPage(page + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ReportsPage;
