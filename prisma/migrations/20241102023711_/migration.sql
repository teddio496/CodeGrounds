/*
  Warnings:

  - You are about to alter the column `forkedFrom` on the `Template` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "t_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'Python',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "forkedFrom" INTEGER,
    CONSTRAINT "Template_forkedFrom_fkey" FOREIGN KEY ("forkedFrom") REFERENCES "Template" ("t_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Template_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("code", "explanation", "forkedFrom", "language", "owner", "public", "t_id", "title") SELECT "code", "explanation", "forkedFrom", "language", "owner", "public", "t_id", "title" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_owner_title_key" ON "Template"("owner", "title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
