import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authors = await prisma.user.findMany({
      distinct: ['username'], 
      select: {
        username: true, 
        avatar: true
      },
    });
    return NextResponse.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching authors." },
      { status: 400 }
    );
  }
}
