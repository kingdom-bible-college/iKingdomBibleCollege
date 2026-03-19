import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { updateCourseVideoOrderTitle } from "@/db/queries/courseVideoOrders";
import { updateCourseVideoTitleSchema } from "@/lib/validations/adminCourses";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateCourseVideoTitleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { courseId, vimeoId, displayTitle } = parsed.data;
  const updated = await updateCourseVideoOrderTitle(courseId, vimeoId, displayTitle);

  if (!updated) {
    return NextResponse.json(
      { error: "강의 영상을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
