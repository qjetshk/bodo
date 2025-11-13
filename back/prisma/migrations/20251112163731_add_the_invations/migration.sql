/*
  Warnings:

  - You are about to drop the column `role` on the `board_members` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "board_invitations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "board_id" TEXT NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "board_invitations_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "board_invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "board_invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_board_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "board_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "board_members_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_board_members" ("board_id", "created_at", "id", "updated_at", "user_id") SELECT "board_id", "created_at", "id", "updated_at", "user_id" FROM "board_members";
DROP TABLE "board_members";
ALTER TABLE "new_board_members" RENAME TO "board_members";
CREATE UNIQUE INDEX "board_members_user_id_board_id_key" ON "board_members"("user_id", "board_id");
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "column_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "performer_id" TEXT,
    CONSTRAINT "tasks_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "columns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tasks_performer_id_fkey" FOREIGN KEY ("performer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("column_id", "created_at", "description", "id", "order", "title", "updated_at") SELECT "column_id", "created_at", "description", "id", "order", "title", "updated_at" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nick_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar_url", "created_at", "email", "id", "nick_name", "password", "updated_at") SELECT "avatar_url", "created_at", "email", "id", "nick_name", "password", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "board_invitations_board_id_user_id_key" ON "board_invitations"("board_id", "user_id");
