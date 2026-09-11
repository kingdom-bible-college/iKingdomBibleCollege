import type { Course, User } from "@/db/schema";

export function canViewCourse(
  course: Pick<Course, "status">,
  user: Pick<User, "role" | "status"> | null
) {
  return Boolean(
    user?.status === "approved" &&
      (course.status === "active" || user.role === "admin")
  );
}
