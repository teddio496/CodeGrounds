import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tags = await prisma.blogPostTag.findMany({
      distinct: ['tag'], 
      select: {
        tag: true
      }
    });

    const tagList = tags.map((tag) => tag.tag);

    return NextResponse.json({ tags: tagList });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tags." },
      { status: 500 }
    );
  }
}
