CREATE SCHEMA "store";

CREATE TABLE "store"."units" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"short" varchar NOT NULL,
	"verified" boolean DEFAULT true NOT NULL,
	CONSTRAINT "units_name_unique" UNIQUE("name"),
	CONSTRAINT "units_short_unique" UNIQUE("short")
);
