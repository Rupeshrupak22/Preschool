import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { currentUser, currentTeacher, currentPrincipal } from "@/lib/security";

export async function POST(request: Request) {
  // Allow any authenticated user (student, teacher, principal, admin)
  const user = await currentUser(request);
  const teacher = await currentTeacher(request);
  const principal = await currentPrincipal(request);

  if (!user && !teacher && !principal) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Validate file size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 100MB." }, { status: 400 });
  }

  // Generate unique filename
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);
  const uniqueName = `${Date.now()}_${safeName}`;

  // Save to public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, uniqueName);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  const fileUrl = `/uploads/${uniqueName}`;

  return NextResponse.json({
    ok: true,
    file: {
      url: fileUrl,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
    },
  });
}
