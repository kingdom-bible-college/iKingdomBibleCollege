import { z } from "zod";

export const updateCourseThumbnailSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  coverImage: z.union([
    z
      .string()
      .startsWith("data:image/")
      .max(2_000_000),
    z.null(),
  ]),
});

export const updateCourseVideoTitleSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  vimeoId: z.string().trim().min(1).max(64),
  displayTitle: z.union([z.string().trim().min(1).max(255), z.null()]),
});
