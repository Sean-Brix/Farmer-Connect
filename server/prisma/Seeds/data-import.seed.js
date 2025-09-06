import fs from 'fs/promises';
import path from 'node:path';
import bcrypt from 'bcrypt';
import { pick, rnd, randomDateBetweenDaysAgo, wait } from './util.js';

const DATA_DIR = path.resolve(process.cwd(), 'prisma', 'Data');

async function readJson(file) {
  try {
    const p = path.join(DATA_DIR, file);
    const buf = await fs.readFile(p, 'utf-8');
    return JSON.parse(buf);
  } catch {
    return null;
  }
}

export async function seedDataAccounts(prisma) {
  const data = await readJson('account.json');
  if (!Array.isArray(data) || data.length === 0) return 0;
  const password = await bcrypt.hash('123456', 10);
  let created = 0;
  for (const a of data) {
    try {
      await prisma.account.upsert({
        where: { username: a.username },
        update: {},
        create: {
          access: a.access ?? 'User',
          username: a.username,
          email: a.email,
          password,
          firstName: a.firstName,
          middleName: a.middleName ?? null,
          surname: a.surname,
          extensionName: a.extensionName ?? null,
          sex: a.sex ?? 'Other',
          street: a.street ?? null,
          barangay: a.barangay ?? null,
          municipality: a.municipality ?? null,
          province: a.province ?? null,
          region: a.region ?? null,
          houseNumber: a.houseNumber ?? null,
          mobileNumber: a.mobileNumber ?? null,
          landlineNumber: a.landlineNumber ?? null,
          birthMunicipality: a.birthMunicipality ?? null,
          birthProvince: a.birthProvince ?? null,
          birthCountry: a.birthCountry ?? null,
          dateOfBirth: a.dateOfBirth ? new Date(a.dateOfBirth) : null,
          religion: a.religion ?? null,
          otherReligionSpecify: a.otherReligionSpecify ?? null,
          civilStatus: a.civilStatus ?? null,
          spouseName: a.spouseName ?? null,
          femaleHouseholdMembers: a.femaleHouseholdMembers ?? null,
          maleHouseholdMembers: a.maleHouseholdMembers ?? null,
          isHouseholdHead: a.isHouseholdHead ?? null,
          householdHeadName: a.householdHeadName ?? null,
          relationshipToHead: a.relationshipToHead ?? null,
          hasGovId: a.hasGovId ?? null,
          govIdType: a.govIdType ?? null,
          govIdNumber: a.govIdNumber ?? null,
          education: a.education ?? null,
          isPWD: a.isPWD ?? null,
          disabilityType: a.disabilityType ?? null,
          livelihoodProfile: a.livelihoodProfile ?? null,
          farmingActivities: a.farmingActivities ?? null,
          fishingActivities: a.fishingActivities ?? null,
          farmworkActivities: a.farmworkActivities ?? null,
          youthActivities: a.youthActivities ?? null,
          otherCropsSpecify: a.otherCropsSpecify ?? null,
          livestockSpecify: a.livestockSpecify ?? null,
          fishingOthersSpecify: a.fishingOthersSpecify ?? null,
          farmworkOthersSpecify: a.farmworkOthersSpecify ?? null,
          youthOthersSpecify: a.youthOthersSpecify ?? null,
          grossAnnualIncome: a.grossAnnualIncome ?? null,
          incomeSource: a.incomeSource ?? null,
          client_profile: a.client_profile ?? 'Other',
          address: a.address ?? null,
          createdAt: randomDateBetweenDaysAgo(540, 0),
        }
      });
      created++;
    } catch {}
  }
  return created;
}

export async function seedDataInventoryItems(prisma) {
  const data = await readJson('inventory_items.json');
  if (!Array.isArray(data) || data.length === 0) return 0;
  let created = 0;
  for (const it of data) {
    try {
      await prisma.inventoryItem.upsert({
        where: { name: it.name },
        update: {},
        create: {
          name: it.name,
          description: it.description ?? null,
          category: it.category ?? 'Other',
          createdAt: randomDateBetweenDaysAgo(540, 0),
        }
      });
      created++;
      if (created % 20 === 0) await wait(10);
    } catch {}
  }
  return created;
}

export async function seedDataSeminars(prisma) {
  const data = await readJson('seminars.json');
  if (!Array.isArray(data) || data.length === 0) return 0;
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  if (!admins.length) return 0;
  let created = 0;
  for (const s of data) {
    try {
      await prisma.seminar.create({
        data: {
          title: s.title,
          description: s.description ?? '',
          location: s.location ?? 'TBD',
          speaker: s.speaker ?? 'TBA',
          start_date: new Date(s.start_date),
          end_date: new Date(s.end_date),
          start_time: s.start_time ?? '09:00',
          end_time: s.end_time ?? '17:00',
          capacity: s.capacity ?? 50,
          registration_deadline: new Date(s.registration_deadline ?? s.start_date),
          status: s.status ?? 'Upcoming',
          createdAt: s.createdAt ? new Date(s.createdAt) : randomDateBetweenDaysAgo(540, 0),
          createdById: pick(admins).id,
        }
      });
      created++;
    } catch {}
  }
  return created;
}

export async function seedDataFAQsAndInquiries(prisma) {
  const data = await readJson('inquiry.json');
  if (!data) return { faqs: 0, inquiries: 0 };
  let faqCount = 0, inqCount = 0;

  if (Array.isArray(data.faqs)) {
    for (const f of data.faqs) {
      try {
        await prisma.fAQ.create({ data: { question: f.question, answer: f.answer, isActive: f.isActive ?? true, orderIndex: faqCount + 1, createdAt: randomDateBetweenDaysAgo(360, 0) } });
        faqCount++;
      } catch {}
    }
  }

  if (Array.isArray(data.inquiries)) {
    const users = await prisma.account.findMany({ where: { access: 'User' }, select: { id: true, firstName: true, surname: true } });
    const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true, firstName: true, surname: true } });
    if (users.length && admins.length) {
      for (const q of data.inquiries) {
        try {
          const user = pick(users);
          const inquiry = await prisma.inquiry.create({
            data: {
              subject: q.subject,
              message: q.message,
              status: q.status ?? 'PENDING',
              userId: user.id,
              createdAt: q.createdAt ? new Date(q.createdAt) : randomDateBetweenDaysAgo(120, 0),
              updatedAt: q.updatedAt ? new Date(q.updatedAt) : randomDateBetweenDaysAgo(120, 0),
            }
          });
          if (Array.isArray(q.replies)) {
            for (const r of q.replies) {
              const isAdmin = (r.senderType ?? 'ADMIN') === 'ADMIN';
              const sender = isAdmin ? pick(admins) : user;
              await prisma.inquiryReply.create({ data: { message: r.message, senderId: sender.id, senderType: isAdmin ? 'ADMIN' : 'USER', senderName: isAdmin ? `${sender.firstName} ${sender.surname}` : undefined, inquiryId: inquiry.id, createdAt: r.createdAt ? new Date(r.createdAt) : randomDateBetweenDaysAgo(120, 0) } });
            }
          }
          inqCount++;
        } catch {}
      }
    }
  }

  return { faqs: faqCount, inquiries: inqCount };
}
