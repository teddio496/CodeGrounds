/*
  Warnings:

  - You are about to drop the column `username` on the `Template` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "t_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "forkedFrom" TEXT,
    CONSTRAINT "Template_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("code", "explanation", "forkedFrom", "public", "t_id", "title") SELECT "code", "explanation", "forkedFrom", "public", "t_id", "title" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_title_key" ON "Template"("title");
CREATE TABLE "new_TemplateTag" (
    "t_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "TemplateTag_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "Template" ("t_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateTag" ("t_id", "tag", "title") SELECT "t_id", "tag", "title" FROM "TemplateTag";
DROP TABLE "TemplateTag";
ALTER TABLE "new_TemplateTag" RENAME TO "TemplateTag";
CREATE UNIQUE INDEX "TemplateTag_t_id_key" ON "TemplateTag"("t_id");
CREATE UNIQUE INDEX "TemplateTag_title_key" ON "TemplateTag"("title");
CREATE UNIQUE INDEX "TemplateTag_tag_title_key" ON "TemplateTag"("tag", "title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
