import { NextResponse } from "next/server";
import { updateCourse } from "@/db/queries/courses";
import { getCourseVideoOrdersByCourseIds } from "@/db/queries/courseVideoOrders";
import { getSessionUser } from "@/lib/auth/session";
import { updateCourseThumbnailSchema } from "@/lib/validations/adminCourses";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateCourseThumbnailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { courseId, heroVimeoId } = parsed.data;
  const orderRows = await getCourseVideoOrdersByCourseIds([courseId]);
  const belongsToCourse = heroVimeoId
    ? orderRows.some((row) => row.vimeoId === heroVimeoId)
    : true;

  if (!belongsToCourse) {
    return NextResponse.json(
      { error: "해당 강의에 포함된 영상만 대표 썸네일로 설정할 수 있습니다." },
      { status: 400 }
    );
  }

  const updated = await updateCourse(courseId, { heroVimeoId });
  if (!updated) {
    return NextResponse.json(
      { error: "강의를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
