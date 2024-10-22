/*
  Warnings:

  - You are about to drop the column `tag` on the `CodeTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `CodeTemplate` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "codeTemplateTitle" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Tag_codeTemplateTitle_fkey" FOREIGN KEY ("codeTemplateTitle") REFERENCES "CodeTemplate" ("title") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeTemplate" (
    "title" TEXT NOT NULL,
    "userUsername" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CodeTemplate_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("code", "explanation", "public", "title", "userUsername") SELECT "code", "explanation", "public", "title", coalesce("userUsername", '') AS "userUsername" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_codeTemplateTitle_key" ON "Tag"("codeTemplateTitle");
