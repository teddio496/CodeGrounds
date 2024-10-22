/*
  Warnings:

  - You are about to drop the column `userUsername` on the `CodeTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `codeTemplateTitle` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `title` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Fork" (
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL DEFAULT '',
    "forkedFrom" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Fork_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fork_forkedFrom_fkey" FOREIGN KEY ("forkedFrom") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeTemplate" (
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CodeTemplate_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("code", "explanation", "public", "title") SELECT "code", "explanation", "public", "title" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");
CREATE TABLE "new_Tag" (
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Tag_title_fkey" FOREIGN KEY ("title") REFERENCES "CodeTemplate" ("title") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tag_title_fkey" FOREIGN KEY ("title") REFERENCES "Fork" ("title") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("tag") SELECT "tag" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_title_key" ON "Tag"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Fork_title_key" ON "Fork"("title");
