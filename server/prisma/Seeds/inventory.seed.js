import { rnd, wait, randomDateBetweenDaysAgo, pick } from './util.js';

export async function seedInventoryItems(prisma, { count = 60 } = {}) {
  // Must match Prisma enum item_category in prisma/schema/item.prisma
  const categories = [
    'Farming_Equipment',
    'Harvesting_Tools',
    'Irrigation_Systems',
    'Storage_Equipment',
    'Processing_Equipment',
    'Safety_Gear',
    'Pest_Control',
    'Livestock_Equipment',
    'Measuring_Tools',
    'Fisheries',
    'Machinery',
    'Other',
  ];
  for (let i = 0; i < count; i++) {
    const name = `${pick(['Portable','Manual','Electric','Gas'])} ${pick(['Seeder','Pump','Cutter','Dryer','Sprayer','Shovel','Cart'])} ${rnd.string.alphanumeric(3).toUpperCase()}`;
    await prisma.inventoryItem.create({ data: { name, description: rnd.lorem.sentence(), category: pick(categories) } });
    if (i % 25 === 0) await wait(30);
  }
}

export async function seedItemStacks(prisma) {
  const items = await prisma.inventoryItem.findMany({ select: { id: true } });
  const statuses = ['Available','Unavailable','Damaged','EIC','Distributed'];
  for (const it of items) {
    for (const st of statuses) {
      await prisma.itemStack.create({ data: { itemId: it.id, quantity: rnd.number.int({min:0, max:80}), status: st, date_limit: Math.random() < 0.3 ? rnd.number.int({min:1, max:30}) : null } });
    }
  }
}

export async function seedItemTransactions(prisma, { perStackMax = 5 } = {}) {
  const stacks = await prisma.itemStack.findMany({ where: { status: { in: ['EIC','Distributed'] } }, select: { id: true, status: true, quantity: true } });
  const users = await prisma.account.findMany({ where: { access: 'User' }, select: { id: true } });
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  if (!stacks.length || !users.length) return;
  const statuses = ['Pending','Approved','Rejected','Returned','No_Return','late_return','No_Pickup','Cancelled'];
  for (const s of stacks) {
    const n = rnd.number.int({min: 0, max: perStackMax});
    for (let i = 0; i < n; i++) {
      const pickupDate = randomDateBetweenDaysAgo(360, -30);
      const returnDate = s.status === 'EIC' && Math.random() < 0.8 ? randomDateBetweenDaysAgo(330, -10) : null;
      await prisma.itemTransaction.create({
        data: {
          itemStackId: s.id,
          accountId: pick(users).id,
          adminId: Math.random() < 0.7 ? pick(admins).id : null,
          quantity: rnd.number.int({min:1, max: Math.max(1, Math.min(10, s.quantity))}),
          status: pick(statuses),
          pickupDate,
          returnDate,
          requestNote: Math.random() < 0.3 ? rnd.lorem.sentence() : null,
        }
      });
    }
  }
}
