/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_read_receipts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crop_monthly_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inquiries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inquiry_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inquiry_replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item_stacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registered_crops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seminar_participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seminars` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_fields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_forms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_attachments` DROP FOREIGN KEY `chat_attachments_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_attachments` DROP FOREIGN KEY `chat_attachments_uploadedById_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_replyToId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_participants` DROP FOREIGN KEY `chat_participants_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_participants` DROP FOREIGN KEY `chat_participants_userId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_read_receipts` DROP FOREIGN KEY `chat_read_receipts_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_read_receipts` DROP FOREIGN KEY `chat_read_receipts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `crop_monthly_reports` DROP FOREIGN KEY `crop_monthly_reports_cropId_fkey`;

-- DropForeignKey
ALTER TABLE `faqs` DROP FOREIGN KEY `faqs_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `inquiries` DROP FOREIGN KEY `inquiries_assignedToId_fkey`;

-- DropForeignKey
ALTER TABLE `inquiries` DROP FOREIGN KEY `inquiries_resolvedById_fkey`;

-- DropForeignKey
ALTER TABLE `inquiries` DROP FOREIGN KEY `inquiries_userId_fkey`;

-- DropForeignKey
ALTER TABLE `inquiry_attachments` DROP FOREIGN KEY `inquiry_attachments_inquiryId_fkey`;

-- DropForeignKey
ALTER TABLE `inquiry_attachments` DROP FOREIGN KEY `inquiry_attachments_uploadedById_fkey`;

-- DropForeignKey
ALTER TABLE `inquiry_replies` DROP FOREIGN KEY `inquiry_replies_inquiryId_fkey`;

-- DropForeignKey
ALTER TABLE `inquiry_replies` DROP FOREIGN KEY `inquiry_replies_parentReplyId_fkey`;

-- DropForeignKey
ALTER TABLE `inquiry_replies` DROP FOREIGN KEY `inquiry_replies_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `item_stacks` DROP FOREIGN KEY `item_stacks_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `item_transactions` DROP FOREIGN KEY `item_transactions_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `item_transactions` DROP FOREIGN KEY `item_transactions_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `item_transactions` DROP FOREIGN KEY `item_transactions_itemStackId_fkey`;

-- DropForeignKey
ALTER TABLE `registered_crops` DROP FOREIGN KEY `registered_crops_userId_fkey`;

-- DropForeignKey
ALTER TABLE `seminar_participants` DROP FOREIGN KEY `seminar_participants_account_id_fkey`;

-- DropForeignKey
ALTER TABLE `seminar_participants` DROP FOREIGN KEY `seminar_participants_seminar_id_fkey`;

-- DropForeignKey
ALTER TABLE `seminars` DROP FOREIGN KEY `seminars_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `survey_answers` DROP FOREIGN KEY `survey_answers_fieldId_fkey`;

-- DropForeignKey
ALTER TABLE `survey_answers` DROP FOREIGN KEY `survey_answers_responseId_fkey`;

-- DropForeignKey
ALTER TABLE `survey_fields` DROP FOREIGN KEY `survey_fields_surveyFormId_fkey`;

-- DropForeignKey
ALTER TABLE `survey_forms` DROP FOREIGN KEY `survey_forms_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `survey_responses` DROP FOREIGN KEY `survey_responses_surveyFormId_fkey`;

-- DropForeignKey
ALTER TABLE `survey_responses` DROP FOREIGN KEY `survey_responses_userId_fkey`;

-- DropForeignKey
ALTER TABLE `survey_statistics` DROP FOREIGN KEY `survey_statistics_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `survey_statistics` DROP FOREIGN KEY `survey_statistics_surveyFormId_fkey`;

-- DropForeignKey
ALTER TABLE `user_preferences` DROP FOREIGN KEY `user_preferences_userId_fkey`;

-- DropTable
DROP TABLE `accounts`;

-- DropTable
DROP TABLE `audit_logs`;

-- DropTable
DROP TABLE `chat_attachments`;

-- DropTable
DROP TABLE `chat_messages`;

-- DropTable
DROP TABLE `chat_participants`;

-- DropTable
DROP TABLE `chat_read_receipts`;

-- DropTable
DROP TABLE `chat_rooms`;

-- DropTable
DROP TABLE `crop_monthly_reports`;

-- DropTable
DROP TABLE `faqs`;

-- DropTable
DROP TABLE `inquiries`;

-- DropTable
DROP TABLE `inquiry_attachments`;

-- DropTable
DROP TABLE `inquiry_replies`;

-- DropTable
DROP TABLE `inventory_items`;

-- DropTable
DROP TABLE `item_stacks`;

-- DropTable
DROP TABLE `item_transactions`;

-- DropTable
DROP TABLE `registered_crops`;

-- DropTable
DROP TABLE `seminar_participants`;

-- DropTable
DROP TABLE `seminars`;

-- DropTable
DROP TABLE `survey_answers`;

-- DropTable
DROP TABLE `survey_fields`;

-- DropTable
DROP TABLE `survey_forms`;

-- DropTable
DROP TABLE `survey_responses`;

-- DropTable
DROP TABLE `survey_statistics`;

-- DropTable
DROP TABLE `user_preferences`;
