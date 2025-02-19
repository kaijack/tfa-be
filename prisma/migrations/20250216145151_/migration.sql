/*
  Warnings:

  - The primary key for the `menus` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_parent_id_fkey";

-- AlterTable
ALTER TABLE "menus" DROP CONSTRAINT "menus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "menus_id_seq";

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
