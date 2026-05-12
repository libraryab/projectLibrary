-- Add isbn, year, description columns to Book
ALTER TABLE "Book"
ADD COLUMN IF NOT EXISTS "isbn" text;

ALTER TABLE "Book"
ADD COLUMN IF NOT EXISTS "year" integer;

ALTER TABLE "Book"
ADD COLUMN IF NOT EXISTS "description" text;
