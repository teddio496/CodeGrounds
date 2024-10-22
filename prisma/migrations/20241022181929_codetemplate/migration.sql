-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodeTemplate" (
    "username" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL DEFAULT '',
    "tag" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "userUsername" TEXT,
    CONSTRAINT "CodeTemplate_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User" ("username") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("code", "explanation", "public", "tag", "title", "userUsername", "username") SELECT "code", "explanation", "public", "tag", "title", "userUsername", "username" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
