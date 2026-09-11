import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateCourse } from "@/db/queries/courses";
import { getSessionUser } from "@/lib/auth/session";
import { updateCourseStatusSchema } from "@/lib/validations/adminCourses";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin" || user.status !== "approved") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = updateCourseStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "올바른 강의와 게시 상태를 선택해 주세요." }, { status: 400 });
  }
  const course = await updateCourse(parsed.data.courseId, { status: parsed.data.status });
  if (!course) return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`, "layout");
  return NextResponse.json({ ok: true, status: course.status });
}
