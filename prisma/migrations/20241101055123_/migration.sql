/*
  Warnings:

  - Added the required column `explanation` to the `reportedBlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explanation` to the `reportedComment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reportedBlog" (
    "b_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reportedBlog_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reportedBlog_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reportedBlog" ("b_id", "createdAt", "username") SELECT "b_id", "createdAt", "username" FROM "reportedBlog";
DROP TABLE "reportedBlog";
ALTER TABLE "new_reportedBlog" RENAME TO "reportedBlog";
CREATE UNIQUE INDEX "reportedBlog_b_id_username_key" ON "reportedBlog"("b_id", "username");
CREATE TABLE "new_reportedComment" (
    "c_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reportedComment_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Comment" ("c_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reportedComment_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reportedComment" ("c_id", "createdAt", "username") SELECT "c_id", "createdAt", "username" FROM "reportedComment";
DROP TABLE "reportedComment";
ALTER TABLE "new_reportedComment" RENAME TO "reportedComment";
CREATE UNIQUE INDEX "reportedComment_c_id_username_key" ON "reportedComment"("c_id", "username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
