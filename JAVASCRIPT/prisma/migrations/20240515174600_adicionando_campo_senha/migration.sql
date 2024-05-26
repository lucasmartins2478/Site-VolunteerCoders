/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senha` to the `alunos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alunos` ADD COLUMN `senha` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `alunos_email_key` ON `alunos`(`email`);
