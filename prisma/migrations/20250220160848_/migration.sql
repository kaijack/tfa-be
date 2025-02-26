/*
  Warnings:

  - You are about to drop the column `parent_name` on the `menus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "menus" DROP COLUMN "parent_name",
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
