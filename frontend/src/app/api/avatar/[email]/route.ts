import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

// Serves avatar image for any user by email — converts base64 from DB to binary image response
export async function GET(request: Request, { params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);

  const pool = await connectDb();
  if (!pool) {
    return new NextResponse(null, { status: 404 });
  }

  const [rows] = await pool.query<any[]>(
    "SELECT avatar_url FROM users WHERE email = ? LIMIT 1",
    [decodedEmail]
  );

  const avatarUrl = rows[0]?.avatar_url;
  if (!avatarUrl) {
    return new NextResponse(null, { status: 404 });
  }

  // If it's a base64 data URL, convert to binary image response
  if (avatarUrl.startsWith("data:")) {
    const matches = avatarUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400", // Cache for 24h
        },
      });
    }
  }

  // If it's a URL, redirect to it
  if (avatarUrl.startsWith("http")) {
    return NextResponse.redirect(avatarUrl);
  }

  return new NextResponse(null, { status: 404 });
}
