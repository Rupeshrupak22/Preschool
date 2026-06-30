import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

// GET /api/avatar?email=user@example.com
// Serves avatar image — converts base64 from DB to binary image response
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse(null, { status: 400 });
  }

  const pool = await connectDb();
  if (!pool) {
    return new NextResponse(null, { status: 404 });
  }

  const [rows] = await pool.query<any[]>(
    "SELECT avatar_url FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [email]
  );

  const avatarUrl = rows[0]?.avatar_url;
  if (!avatarUrl) {
    return new NextResponse(null, { status: 404 });
  }

  // Base64 data URL → binary image response
  if (avatarUrl.startsWith("data:")) {
    const matches = avatarUrl.match(/^data:([^;]+);base64,(.+)$/s);
    if (matches) {
      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }

  // HTTP URL → redirect
  if (avatarUrl.startsWith("http") || avatarUrl.startsWith("/uploads")) {
    const url = avatarUrl.startsWith("/uploads")
      ? `https://preschool-wzjj.onrender.com${avatarUrl}`
      : avatarUrl;
    return NextResponse.redirect(url);
  }

  return new NextResponse(null, { status: 404 });
}
