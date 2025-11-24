-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_column_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "template_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "column_templates_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "board_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_column_templates" ("created_at", "id", "order", "template_id", "title", "updated_at") SELECT "created_at", "id", "order", "template_id", "title", "updated_at" FROM "column_templates";
DROP TABLE "column_templates";
ALTER TABLE "new_column_templates" RENAME TO "column_templates";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
