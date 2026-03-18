import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Проверяем авторизацию
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const dbPath = dbUrl.replace("file:", "");
  const absolutePath = dbPath.startsWith(".")
    ? join(process.cwd(), dbPath)
    : dbPath;

  if (!existsSync(absolutePath)) {
    return NextResponse.json({ error: "Database file not found" }, { status: 404 });
  }

  const fileBuffer = readFileSync(absolutePath);
  const timestamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="backup-${timestamp}.db"`,
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
