import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/db/queries/courses";
import { getSessionUser } from "@/lib/auth/session";

const parseDataUrl = (value: string) => {
  const match = value.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) return null;

  const [, contentType, payload] = match;
  return {
    contentType,
    buffer: Buffer.from(payload, "base64"),
  };
};

type RouteContext = {
  params: Promise<{ courseSlug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user || user.status !== "approved") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { courseSlug } = await params;
  const course = await getCourseBySlug(decodeURIComponent(courseSlug));

  if (!course?.coverImage) {
    return new NextResponse("Not found", { status: 404 });
  }

  const parsed = parseDataUrl(course.coverImage);
  if (!parsed) {
    return new NextResponse("Invalid image", { status: 400 });
  }

  return new NextResponse(parsed.buffer, {
    headers: {
      "Content-Type": parsed.contentType,
      "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
