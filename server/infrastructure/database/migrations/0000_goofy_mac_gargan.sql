CREATE SCHEMA "auth";

CREATE TABLE "auth"."users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"emailVerifiedAt" timestamp with time zone,
	"password" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
