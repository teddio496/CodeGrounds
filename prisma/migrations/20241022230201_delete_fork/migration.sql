-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeTemplate" (
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "forkedFrom" TEXT,
    CONSTRAINT "CodeTemplate_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("code", "explanation", "forkedFrom", "public", "title", "username") SELECT "code", "explanation", "forkedFrom", "public", "title", "username" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
