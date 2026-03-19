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
