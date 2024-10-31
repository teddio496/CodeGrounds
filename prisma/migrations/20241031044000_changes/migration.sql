/*
  Warnings:

  - You are about to drop the column `title` on the `TemplateTag` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TemplateTag" (
    "t_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "TemplateTag_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "Template" ("t_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateTag" ("t_id", "tag") SELECT "t_id", "tag" FROM "TemplateTag";
DROP TABLE "TemplateTag";
ALTER TABLE "new_TemplateTag" RENAME TO "TemplateTag";
CREATE UNIQUE INDEX "TemplateTag_tag_t_id_key" ON "TemplateTag"("tag", "t_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
