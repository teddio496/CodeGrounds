/*
  Warnings:

  - You are about to drop the `CodeTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CodeTemplate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Template" (
    "t_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "forkedFrom" TEXT,
    CONSTRAINT "Template_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TemplateTag" (
    "t_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "TemplateTag_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "Template" ("t_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "b_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hidden" BOOLEAN NOT NULL,
    CONSTRAINT "BlogPost_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPostTag" (
    "b_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "BlogPostTag_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "c_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("c_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reportedBlog" (
    "b_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    CONSTRAINT "reportedBlog_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reportedBlog_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reportedComment" (
    "c_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    CONSTRAINT "reportedComment_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Comment" ("c_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reportedComment_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_title_key" ON "Template"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateTag_t_id_key" ON "TemplateTag"("t_id");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateTag_title_key" ON "TemplateTag"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateTag_tag_title_key" ON "TemplateTag"("tag", "title");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostTag_b_id_key" ON "BlogPostTag"("b_id");

-- CreateIndex
CREATE UNIQUE INDEX "reportedBlog_b_id_username_key" ON "reportedBlog"("b_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "reportedComment_c_id_username_key" ON "reportedComment"("c_id", "username");
