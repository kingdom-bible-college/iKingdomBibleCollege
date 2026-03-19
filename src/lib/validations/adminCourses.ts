import { z } from "zod";

export const updateCourseThumbnailSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  heroVimeoId: z.union([z.string().min(1).max(64), z.null()]),
});
