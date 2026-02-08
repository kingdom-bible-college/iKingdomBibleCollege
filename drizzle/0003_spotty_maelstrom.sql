CREATE TABLE "course_video_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"vimeo_id" varchar(64) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_video_orders" ADD CONSTRAINT "course_video_orders_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;