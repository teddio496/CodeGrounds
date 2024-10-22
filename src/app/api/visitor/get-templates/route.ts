import { prisma } from "@/utils/prismaClient";

export async function GET(req: Request) {
  const { title, author, code, explanation, tags } = await req.json();
  try {

    return Response.json({ status: 200 });
  }
  catch (e) {
    console.log(e);
    return Response.json({ error: "failed to retrieve template" });
  }
}