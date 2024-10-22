/*
  Warnings:

  - You are about to drop the `Fork` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Fork_title_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Fork";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeTemplate" (
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "forkedFrom" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "CodeTemplate_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("code", "explanation", "public", "title", "username") SELECT "code", "explanation", "public", "title", "username" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");
CREATE TABLE "new_Tag" (
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Tag_title_fkey" FOREIGN KEY ("title") REFERENCES "CodeTemplate" ("title") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("tag", "title") SELECT "tag", "title" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_title_key" ON "Tag"("title");
CREATE UNIQUE INDEX "Tag_tag_title_key" ON "Tag"("tag", "title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
