CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "store";
--> statement-breakpoint
CREATE SCHEMA "website";
--> statement-breakpoint
CREATE TYPE "website"."complaints_subject_enum" AS ENUM('general_inquiry', 'support_request', 'feedback', 'billing_issue', 'partnership_opportunity', 'job_application', 'feature_request', 'bug_report', 'account_help', 'other');--> statement-breakpoint
CREATE TABLE "store"."categories" (
	"id" varchar NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar,
	"image" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "categories_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "unique_category_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "website"."complaints" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"subject" "website"."complaints_subject_enum" DEFAULT 'other' NOT NULL,
	"content" varchar NOT NULL,
	"reviewed" boolean DEFAULT false,
	CONSTRAINT "complaints_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "store"."demands" (
	"id" varchar NOT NULL,
	"content" varchar NOT NULL,
	"userId" varchar NOT NULL,
	"images" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "demands_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "store"."products" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"pricePu" numeric NOT NULL,
	"maxQty" numeric,
	CONSTRAINT "products_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "store"."proposals" (
	"id" varchar NOT NULL,
	"content" varchar NOT NULL,
	"productId" varchar NOT NULL,
	"demandId" varchar NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "proposals_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "store"."subs" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"categoryId" varchar NOT NULL,
	CONSTRAINT "subs_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "unique_sub_category_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "store"."units" (
	"id" varchar NOT NULL,
	"name" varchar(256) NOT NULL,
	"alias" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "units_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "unique_unit_name" UNIQUE("name"),
	CONSTRAINT "unique_unit_shortname" UNIQUE("alias")
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "users_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "unique_user_email" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "store"."subs" ADD CONSTRAINT "subs_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "store"."categories"("id") ON DELETE no action ON UPDATE no action;