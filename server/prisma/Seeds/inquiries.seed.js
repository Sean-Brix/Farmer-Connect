import { rnd, wait, randomDateBetweenDaysAgo, pick } from './util.js';

export async function seedFAQCategories(prisma) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  if (!admins.length) return;
  
  const categories = [
    { name: 'General', description: 'General questions and information', orderIndex: 1 },
    { name: 'Farming', description: 'Questions about farming and agriculture', orderIndex: 2 },
    { name: 'Equipment', description: 'Questions about equipment and tools', orderIndex: 3 },
    { name: 'Seminars', description: 'Questions about seminars and training', orderIndex: 4 },
    { name: 'Inventory', description: 'Questions about inventory and distribution', orderIndex: 5 },
    { name: 'Technical', description: 'Technical support and troubleshooting', orderIndex: 6 },
  ];

  for (const cat of categories) {
    // Check if category already exists
    const existing = await prisma.fAQCategory.findFirst({ where: { name: cat.name } });
    if (!existing) {
      await prisma.fAQCategory.create({
        data: {
          name: cat.name,
          description: cat.description,
          orderIndex: cat.orderIndex,
          isActive: true,
          createdById: pick(admins).id,
          createdAt: randomDateBetweenDaysAgo(365, 300),
        },
      });
    }
  }
}

export async function seedFAQs(prisma, { count = 30 } = {}) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  
  // Get all categories, but ensure "General" exists as fallback
  let categories = await prisma.fAQCategory.findMany({ select: { id: true, name: true } });
  let generalCategory = categories.find(c => c.name === 'General');
  
  // If no General category exists, create it
  if (!generalCategory) {
    generalCategory = await prisma.fAQCategory.create({
      data: {
        name: 'General',
        description: 'General questions and information',
        orderIndex: 1,
        isActive: true,
        createdById: admins.length > 0 ? pick(admins).id : undefined,
      },
    });
    categories.push(generalCategory);
  }
  
  const categoryPool = categories.length > 0 ? categories : [generalCategory];
  
  for (let i = 0; i < count; i++) {
    // 70% of FAQs get a random category, 30% specifically use General
    const category = Math.random() < 0.7 ? pick(categoryPool) : generalCategory;
    
    await prisma.fAQ.create({ 
      data: { 
        question: rnd.lorem.sentence(), 
        answer: rnd.lorem.paragraph(), 
        isActive: Math.random() < 0.9, 
        orderIndex: i+1, 
        viewCount: rnd.number.int({min:0, max:500}), 
        helpfulCount: rnd.number.int({min:0, max:200}), 
        categoryId: category.id,
        createdById: pick(admins).id, 
        createdAt: randomDateBetweenDaysAgo(360,0) 
      } 
    });
  }
}

// InquiryTemplate model not present in current schema; skipping template seeding

export async function seedInquiries(prisma, { count = 150 } = {}) {
  const users = await prisma.account.findMany({ where: { access: 'User' }, select: { id: true, firstName: true, surname: true, createdAt: true } });
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true, firstName: true, surname: true } });
  if (!users.length || !admins.length) return;
  const statusMap = ['RESOLVED','PENDING','IN_PROGRESS','WAITING_USER','CANCELLED'];
  for (let i = 0; i < count; i++) {
    const createdAt = randomDateBetweenDaysAgo(540, 0);
    const status = pick(statusMap);
    const user = pick(users);
    const admin = pick(admins);
    const assigned = ['IN_PROGRESS','WAITING_USER','RESOLVED'].includes(status) ? admin.id : null;
    const inquiry = await prisma.inquiry.create({ data: { subject: rnd.lorem.words(6), message: rnd.lorem.sentences(2), status, userId: user.id, assignedToId: assigned, createdAt } });
    const replyCount = rnd.number.int({min: 1, max: 6});
    for (let r = 0; r < replyCount; r++) {
      const isFromUser = Math.random() < 0.6;
      await prisma.inquiryReply.create({ data: { message: rnd.lorem.sentence(), senderId: isFromUser ? user.id : admin.id, senderType: isFromUser ? 'USER' : 'ADMIN', senderName: isFromUser ? `${user.firstName} ${user.surname}` : `${admin.firstName} ${admin.surname}`, inquiryId: inquiry.id, createdAt: randomDateBetweenDaysAgo(540, 0) } });
    }
    await prisma.inquiry.update({ where: { id: inquiry.id }, data: { updatedAt: randomDateBetweenDaysAgo(540, 0), resolvedAt: status === 'RESOLVED' ? randomDateBetweenDaysAgo(360, 0) : null } });
  }
}
