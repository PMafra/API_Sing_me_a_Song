CREATE TABLE "songs" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"youtubeLink" TEXT NOT NULL,
	"score" integer NOT NULL DEFAULT 1,
	CONSTRAINT "songs_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);