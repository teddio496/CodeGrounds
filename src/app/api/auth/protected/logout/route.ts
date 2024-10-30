import { NextRequest, NextResponse } from "next/server";

export default function POST(req: NextRequest) {
  try {
    // delete accessToken cookie from both req and res
    req.cookies.delete("accessToken");
    const res = NextResponse.json({ message: "logout successful" }, { status: 201 });
    res.cookies.delete("accessToken");
    return res;
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "something went wrong with logout" }, { status: 500 });
  }
}