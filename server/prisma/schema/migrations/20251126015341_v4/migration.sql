-- CreateIndex
CREATE INDEX `inquiries_updatedAt_idx` ON `inquiries`(`updatedAt`);

-- CreateIndex
CREATE INDEX `inquiries_status_updatedAt_idx` ON `inquiries`(`status`, `updatedAt`);

-- CreateIndex
CREATE INDEX `inquiry_replies_readByAdmin_senderType_idx` ON `inquiry_replies`(`readByAdmin`, `senderType`);

-- CreateIndex
CREATE INDEX `inquiry_replies_readByUser_senderType_idx` ON `inquiry_replies`(`readByUser`, `senderType`);

-- CreateIndex
CREATE INDEX `planting_reports_isArchived_idx` ON `planting_reports`(`isArchived`);

-- CreateIndex
CREATE INDEX `planting_reports_rsbsaNumber_idx` ON `planting_reports`(`rsbsaNumber`);

-- CreateIndex
CREATE INDEX `planting_reports_typeOfCrop_croppingSeasonId_idx` ON `planting_reports`(`typeOfCrop`, `croppingSeasonId`);

-- CreateIndex
CREATE INDEX `planting_reports_dateOfPlanting_isArchived_idx` ON `planting_reports`(`dateOfPlanting`, `isArchived`);

-- CreateIndex
CREATE INDEX `survey_forms_status_idx` ON `survey_forms`(`status`);

-- CreateIndex
CREATE INDEX `survey_forms_category_idx` ON `survey_forms`(`category`);

-- CreateIndex
CREATE INDEX `survey_forms_createdAt_idx` ON `survey_forms`(`createdAt`);

-- CreateIndex
CREATE INDEX `survey_forms_status_category_idx` ON `survey_forms`(`status`, `category`);

-- CreateIndex
CREATE INDEX `survey_responses_submittedAt_idx` ON `survey_responses`(`submittedAt`);

-- RenameIndex
ALTER TABLE `survey_responses` RENAME INDEX `survey_responses_surveyFormId_fkey` TO `survey_responses_surveyFormId_idx`;
