import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

  try {
    await syncCourseVideoMetadata(courseId, orderedVideoIds);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save course videos";
    console.error("Failed to reorder course videos", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
