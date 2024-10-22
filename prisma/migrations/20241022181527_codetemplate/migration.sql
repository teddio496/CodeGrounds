-- CreateTable
CREATE TABLE "CodeTemplate" (
    "username" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL DEFAULT '',
    "tag" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "userUsername" TEXT,
    CONSTRAINT "CodeTemplate_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User" ("username") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'User',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("avatar", "createdAt", "firstName", "lastName", "password", "phoneNumber", "username") SELECT "avatar", "createdAt", "firstName", "lastName", "password", "phoneNumber", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");
