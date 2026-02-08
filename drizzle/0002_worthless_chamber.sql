CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"instructor" varchar(255) DEFAULT '' NOT NULL,
	"level" varchar(64) DEFAULT '입문 - 초급' NOT NULL,
	"last_updated" varchar(32) DEFAULT '' NOT NULL,
	"hero_vimeo_id" varchar(64),
	"match_type" varchar(16) DEFAULT 'prefix' NOT NULL,
	"match_value" varchar(255) NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
