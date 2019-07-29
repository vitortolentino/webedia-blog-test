
CREATE TABLE IF NOT EXISTS "authors" (
  "id" SERIAL ,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY ("id")
);

ALTER TABLE "public"."authors" ADD COLUMN "status" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS "articles" (
  "id" SERIAL,
  "title" VARCHAR(255) NOT NULL,
  "subtitle" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "permalink" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY ("id")
);

ALTER TABLE "public"."articles" ADD COLUMN "author_id" INTEGER REFERENCES "authors" ("id");
