import { rnd, randomDateBetweenDaysAgo, pick, wait } from './util.js';

export async function seedChat(prisma, { rooms = 25, maxParticipants = 6, maxMessages = 60 } = {}) {
  const users = await prisma.account.findMany({ select: { id: true, firstName: true, surname: true } });
  if (users.length < 3) return;

  const roomTypes = ['DIRECT','GROUP','SUPPORT'];
  for (let i = 0; i < rooms; i++) {
    const isGroup = Math.random() < 0.6;
    const roomType = isGroup ? pick(['GROUP','SUPPORT']) : 'DIRECT';
    const createdAt = randomDateBetweenDaysAgo(540, 0);
    const room = await prisma.chatRoom.create({
      data: {
        name: isGroup ? `${pick(['Agri','Fisher','Youth','Ops'])} ${pick(['Team','Circle','Hub'])}` : null,
        isGroup,
        roomType,
        createdAt,
        lastActivity: createdAt,
      },
    });

    // Participants
    const participantCount = isGroup ? rnd.number.int({ min: 3, max: Math.min(maxParticipants, users.length) }) : 2;
    const chosen = [...users].sort(() => Math.random() - 0.5).slice(0, participantCount);
    await prisma.chatParticipant.createMany({
      data: chosen.map((u) => ({ userId: u.id, roomId: room.id, role: 'MEMBER', lastSeen: createdAt, joinedAt: createdAt })),
      skipDuplicates: true,
    });

    // Messages spread over time
    const msgCount = rnd.number.int({ min: 3, max: maxMessages });
    let last = createdAt;
    for (let m = 0; m < msgCount; m++) {
      last = randomDateBetweenDaysAgo(540, 0);
      const sender = pick(chosen);
      const message = await prisma.chatMessage.create({
        data: {
          content: rnd.lorem.sentence(),
          senderId: sender.id,
          roomId: room.id,
          createdAt: last,
        },
      });
      // read receipts for a subset
      for (const u of chosen) {
        if (u.id === sender.id) continue;
        if (Math.random() < 0.7) {
          await prisma.chatReadReceipt.create({ data: { messageId: message.id, userId: u.id, readAt: new Date(last.getTime() + rnd.number.int({ min: 1000, max: 3600 * 1000 })) } });
        }
      }
    }

    await prisma.chatRoom.update({ where: { id: room.id }, data: { lastActivity: last } });
    if (i % 10 === 0) await wait(30);
  }
}
