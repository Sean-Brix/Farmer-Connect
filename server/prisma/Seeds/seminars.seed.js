import { rnd, wait, randomDateBetweenDaysAgo, pick } from './util.js';

export async function seedSeminars(prisma, { count = 120 } = {}) {
  const creators = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  if (!creators.length) return;
  const statuses = ['Upcoming','Ongoing','Completed','Cancelled'];
  for (let i = 0; i < count; i++) {
    const start = randomDateBetweenDaysAgo(540, -30);
    const end = new Date(start.getTime() + rnd.number.int({min: 2, max: 8}) * 60 * 60 * 1000);
    const createdAt = new Date(start.getTime() - rnd.number.int({min: 1, max: 60}) * 24 * 60 * 60 * 1000);
    const title = `${pick(['Sustainable','Climate-Smart','Organic','Market Linkage','Irrigation'])} ${pick(['Farming','Practices','Training','Seminar'])}`;
    const status = pick(statuses);
    await prisma.seminar.create({
      data: {
        title,
        description: rnd.lorem.sentences(2),
        location: pick(['Main Hall','Field A','Barangay Center','Online']),
        speaker: `${rnd.person.firstName()} ${rnd.person.lastName()}`,
        start_date: start,
        end_date: end,
        start_time: '09:00',
        end_time: '17:00',
        capacity: rnd.number.int({min:20, max:200}),
        registration_deadline: new Date(start.getTime() - 3*24*60*60*1000),
        status,
        createdAt,
        createdById: pick(creators).id,
      }
    });
    if (i % 20 === 0) await wait(50);
  }
}

export async function seedSeminarParticipants(prisma) {
  const seminars = await prisma.seminar.findMany({ select: { id: true, status: true, createdAt: true } });
  const users = await prisma.account.findMany({ where: { access: 'User' }, select: { id: true } });
  if (!seminars.length || !users.length) return;
  for (const s of seminars) {
  const maxUsers = Math.min(80, users.length);
  const participantCount = maxUsers <= 0 ? 0 : rnd.number.int({min: Math.min(10, maxUsers), max: maxUsers});
    const shuffled = rnd.helpers.shuffle(users).slice(0, participantCount);
    if (shuffled.length === 0) continue;
    const rows = shuffled.map(u => {
      const createdAt = randomDateBetweenDaysAgo(360, 0);
      let status = 'Registered';
      if (s.status === 'Cancelled') status = 'Cancelled';
      else if (s.status === 'Completed') status = pick(['Attended','Not_Attended','Cancelled','Registered']);
      return { seminar_id: s.id, account_id: u.id, status, createdAt };
    });
    await prisma.seminarParticipant.createMany({ data: rows, skipDuplicates: true });
  }
}
