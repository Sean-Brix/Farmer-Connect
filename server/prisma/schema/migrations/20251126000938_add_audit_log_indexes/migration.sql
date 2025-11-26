-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_idx` ON `audit_logs`(`action`);

-- CreateIndex
CREATE INDEX `audit_logs_targetType_idx` ON `audit_logs`(`targetType`);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);
