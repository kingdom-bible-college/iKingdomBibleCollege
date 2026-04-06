import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { syncCourseVideoMetadata } from "@/lib/courseVideoMetadata";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const courseId = Number(body?.courseId);
  const orderedVideoIds = Array.isArray(body?.orderedVideoIds)
    ? body.orderedVideoIds.map((id: unknown) => String(id))
    : null;

  if (!Number.isFinite(courseId) || !orderedVideoIds) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await syncCourseVideoMetadata(courseId, orderedVideoIds);
  return NextResponse.json({ ok: true });
}
