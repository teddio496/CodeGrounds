import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    req.cookies.delete("accessToken"); // more so a safety measure to make sure you don't access req's cookies later
    const res = NextResponse.json({ message: "logout successful" }, { status: 201 });
    res.cookies.delete("accessToken"); // actually removes them from the client (browser)
    return res;
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "something went wrong with logout" }, { status: 500 });
  }
}