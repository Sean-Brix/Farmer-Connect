import { PrismaClient, audit_action } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.account.findFirst({ where: {} });
  if (!admin) {
    console.log('No accounts found. Please run seeds first.');
    return;
  }
  const action = audit_action.INQUIRY_REPLY ?? audit_action.LOGIN; // fallback if codegen out of date
  const log = await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action,
      targetType: 'SmokeTest',
      targetId: 'enum-check',
      details: 'Smoke test for new enum values',
      metadata: { ok: true, ts: new Date().toISOString() },
    }
  });
  console.log('Created audit log:', { id: log.id, action: log.action });
}

main().catch(e => {
  console.error('Smoke test error:', e.message);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
