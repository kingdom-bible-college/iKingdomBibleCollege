ALTER TABLE "course_video_orders" ADD COLUMN "original_title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "course_video_orders" ADD COLUMN "duration_seconds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "course_video_orders" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "course_video_orders" ADD COLUMN "vimeo_hash" varchar(255);