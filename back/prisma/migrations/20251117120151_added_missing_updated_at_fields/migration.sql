/*
  Warnings:

  - Added the required column `updated_at` to the `board_invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `task_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_board_invitations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "board_id" TEXT NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "board_invitations_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "board_invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "board_invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_board_invitations" ("board_id", "created_at", "id", "invited_by_id", "status", "user_id") SELECT "board_id", "created_at", "id", "invited_by_id", "status", "user_id" FROM "board_invitations";
DROP TABLE "board_invitations";
ALTER TABLE "new_board_invitations" RENAME TO "board_invitations";
CREATE UNIQUE INDEX "board_invitations_board_id_user_id_key" ON "board_invitations"("board_id", "user_id");
CREATE TABLE "new_task_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "task_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "task_assignments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_task_assignments" ("created_at", "id", "task_id", "user_id") SELECT "created_at", "id", "task_id", "user_id" FROM "task_assignments";
DROP TABLE "task_assignments";
ALTER TABLE "new_task_assignments" RENAME TO "task_assignments";
CREATE UNIQUE INDEX "task_assignments_user_id_task_id_key" ON "task_assignments"("user_id", "task_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
