import { rnd, randomDateBetweenDaysAgo, pick, wait } from './util.js';

const actions = [
  'ACCOUNT_CREATE','ACCOUNT_UPDATE','ACCOUNT_DELETE','ACCOUNT_ROLE_CHANGE','ACCOUNT_STATUS_CHANGE',
  'LOGIN','LOGOUT','LOGIN_FAILED',
  'INVENTORY_CREATE','INVENTORY_UPDATE','INVENTORY_DELETE','INVENTORY_STATUS_CHANGE',
  'DISTRIBUTION_CREATE','DISTRIBUTION_UPDATE','DISTRIBUTION_DELETE','DISTRIBUTION_REQUEST_APPROVE','DISTRIBUTION_REQUEST_REJECT','DISTRIBUTION_REQUEST_NO_PICKUP',
  'EIC_CREATE','EIC_UPDATE','EIC_DELETE','EIC_STATUS_CHANGE','EIC_REQUEST_APPROVE','EIC_REQUEST_REJECT','EIC_REQUEST_NO_PICKUP',
  'SEMINAR_CREATE','SEMINAR_UPDATE','SEMINAR_DELETE','SEMINAR_STATUS_CHANGE','SEMINAR_PARTICIPANT_UPDATE',
  'CONTENT_CREATE','CONTENT_UPDATE','CONTENT_DELETE',
  'SYSTEM_BACKUP','SYSTEM_RESTORE','SYSTEM_MAINTENANCE',
  'PROFILE_UPDATE','PROFILE_PICTURE_UPDATE',
  'SETTINGS_UPDATE'
];

const targets = ['Account','Seminar','InventoryItem','ItemStack','ItemTransaction','Inquiry','FAQ','SurveyForm'];

export async function seedAuditLogs(prisma, { count = 400 } = {}) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true, firstName: true, surname: true } });
  if (!admins.length) return;

  for (let i = 0; i < count; i++) {
    const admin = pick(admins);
    const action = pick(actions);
    const targetType = pick(targets);
    const createdAt = randomDateBetweenDaysAgo(720, 0);

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action,
        targetType,
        targetId: rnd.string.alphanumeric(8),
        targetName: rnd.lorem.words(3),
        details: Math.random() < 0.5 ? rnd.lorem.sentence() : null,
        metadata: { ip: `${rnd.number.int({min:10,max:255})}.${rnd.number.int({min:0,max:255})}.${rnd.number.int({min:0,max:255})}.${rnd.number.int({min:0,max:255})}` },
        ipAddress: `${rnd.number.int({min:10,max:255})}.${rnd.number.int({min:0,max:255})}.${rnd.number.int({min:0,max:255})}.${rnd.number.int({min:0,max:255})}`,
        userAgent: pick(['Mozilla/5.0','Chrome/119.0','Edge/120.0','Safari/17.0']),
        createdAt,
      },
    });

    if (i % 50 === 0) await wait(10);
  }
}
