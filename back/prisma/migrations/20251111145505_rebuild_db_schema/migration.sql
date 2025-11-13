/*
  Warnings:

  - Added the required column `boardType` to the `boards` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_boards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "boardType" BOOLEAN NOT NULL,
    "ownerId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "boardTemplateId" TEXT,
    CONSTRAINT "boards_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "boards_boardTemplateId_fkey" FOREIGN KEY ("boardTemplateId") REFERENCES "board_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_boards" ("boardTemplateId", "created_at", "id", "name", "ownerId", "updated_at") SELECT "boardTemplateId", "created_at", "id", "name", "ownerId", "updated_at" FROM "boards";
DROP TABLE "boards";
ALTER TABLE "new_boards" RENAME TO "boards";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
