-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'User',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Template" (
    "t_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "explanation" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "forkedFrom" TEXT,
    CONSTRAINT "Template_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TemplateTag" (
    "t_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "TemplateTag_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "Template" ("t_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "b_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BlogPost_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPostTag" (
    "b_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "BlogPostTag_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "upDownVotes" (
    "isUp" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL,
    "b_id" INTEGER NOT NULL,
    CONSTRAINT "upDownVotes_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "upDownVotes_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "c_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "authorName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("c_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentUpDownVotes" (
    "isUp" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL,
    "c_id" INTEGER NOT NULL,
    CONSTRAINT "CommentUpDownVotes_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Comment" ("c_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentUpDownVotes_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reportedBlog" (
    "b_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reportedBlog_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "BlogPost" ("b_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reportedBlog_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reportedComment" (
    "c_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reportedComment_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Comment" ("c_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reportedComment_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostToTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("b_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template" ("t_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Template_owner_title_key" ON "Template"("owner", "title");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateTag_tag_t_id_key" ON "TemplateTag"("tag", "t_id");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostTag_b_id_tag_key" ON "BlogPostTag"("b_id", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "upDownVotes_username_b_id_key" ON "upDownVotes"("username", "b_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentUpDownVotes_username_c_id_key" ON "CommentUpDownVotes"("username", "c_id");

-- CreateIndex
CREATE UNIQUE INDEX "reportedBlog_b_id_username_key" ON "reportedBlog"("b_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "reportedComment_c_id_username_key" ON "reportedComment"("c_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToTemplate_AB_unique" ON "_BlogPostToTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToTemplate_B_index" ON "_BlogPostToTemplate"("B");
