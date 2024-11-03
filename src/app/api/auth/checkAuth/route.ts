import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const token = cookies
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    return NextResponse.json({ loggedIn: true });
  } catch (e) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}
