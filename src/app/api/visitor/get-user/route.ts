import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const username = url.searchParams.get("username") || "";

  try {
    const author = await prisma.user.findUnique({where: { username }});
    return NextResponse.json(author);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching authors." },
      { status: 400 }
    );
  }
}
