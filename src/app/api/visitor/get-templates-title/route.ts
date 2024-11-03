import { prisma } from "@/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const templates = await prisma.template.findMany({ 
        select : {
          title: true,
          t_id: true,
          language: true,
          explanation: true,
          user: true
        }
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching template titles:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching template titles." },
      { status: 400 }
    );
  }
}
