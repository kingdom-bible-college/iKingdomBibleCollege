import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { deleteCourse } from "@/db/queries/courses";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await deleteCourse(id);
  return NextResponse.json({ ok: true });
}
