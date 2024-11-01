-- CreateTable
CREATE TABLE "CommentUpDownVotes" (
    "isUp" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL,
    "c_id" INTEGER NOT NULL,
    CONSTRAINT "CommentUpDownVotes_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "Comment" ("c_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentUpDownVotes_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentUpDownVotes_username_c_id_key" ON "CommentUpDownVotes"("username", "c_id");
