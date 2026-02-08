import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { updateCourse } from "@/db/queries/courses";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const orderedIds = Array.isArray(body?.orderedIds) ? body.orderedIds : null;
  if (!orderedIds) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  for (let index = 0; index < orderedIds.length; index += 1) {
    const id = Number(orderedIds[index]);
    if (!Number.isFinite(id)) continue;
    await updateCourse(id, { sortOrder: index + 1 });
  }

  return NextResponse.json({ ok: true });
}
