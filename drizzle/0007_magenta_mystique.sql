WITH ranked_duplicates AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY course_id, vimeo_id
      ORDER BY sort_order ASC, id ASC
    ) AS duplicate_rank
  FROM "course_video_orders"
)
DELETE FROM "course_video_orders"
WHERE id IN (
  SELECT id
  FROM ranked_duplicates
  WHERE duplicate_rank > 1
);--> statement-breakpoint

WITH ranked_orders AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY course_id
      ORDER BY sort_order ASC, id ASC
    ) AS next_sort_order
  FROM "course_video_orders"
)
UPDATE "course_video_orders" AS target
SET "sort_order" = ranked_orders.next_sort_order
FROM ranked_orders
WHERE target.id = ranked_orders.id
  AND target.sort_order <> ranked_orders.next_sort_order;--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "course_video_orders_course_id_vimeo_id_unique" ON "course_video_orders" USING btree ("course_id","vimeo_id");
