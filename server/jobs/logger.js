/**
 * Cleanup job logger
 * Writes cleanup events to console and a log file.
 */
import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'cleanup.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export function logCleanup(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;

  // Console
  console.log(line.trimEnd());

  // Append to file
  fs.appendFileSync(logFile, line, 'utf8');
}

export function logCleanupResult(result) {
  const summary = result.success
    ? `✅ Cleanup completed: ${result.deleted || 0} reports deleted`
    : `❌ Cleanup failed: ${result.error}`;

  logCleanup(summary);

  if (result.reports) {
    result.reports.forEach((r) => {
      logCleanup(`   - Deleted: ${r.farmerName} (${r.id})`);
    });
  }
}
