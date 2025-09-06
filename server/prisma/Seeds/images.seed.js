import fs from 'fs/promises';
import path from 'node:path';

const IMAGES_DIR = path.resolve(process.cwd(), 'prisma', 'Data', 'Images');

async function readDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function loadImage(filePath) {
  try {
    const data = await fs.readFile(filePath);
    // Infer mimetype from extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';
    return { data, mimeType };
  } catch {
    return null;
  }
}

export async function seedAccountImages(prisma) {
  const accountsDir = path.join(IMAGES_DIR, 'Accounts');
  const entries = await readDirSafe(accountsDir);
  if (!entries.length) return 0;

  const files = entries.filter(e => e.isFile()).map(e => path.join(accountsDir, e.name));
  if (!files.length) return 0;

  // Fetch candidate accounts without pictures
  const accounts = await prisma.account.findMany({
    where: { OR: [{ picture: null }, { picture: { equals: Buffer.from('') } }] },
    select: { id: true },
    take: files.length,
  });
  if (!accounts.length) return 0;

  let updated = 0;
  for (let i = 0; i < accounts.length; i++) {
    const f = files[i % files.length];
    const img = await loadImage(f);
    if (!img) continue;
    try {
      await prisma.account.update({
        where: { id: accounts[i].id },
        data: { picture: img.data, mimeType: img.mimeType },
      });
      updated++;
    } catch {}
  }
  return updated;
}

export async function seedSeminarImages(prisma) {
  const seminarsDir = path.join(IMAGES_DIR, 'Seminars');
  const entries = await readDirSafe(seminarsDir);
  if (!entries.length) return 0;

  const files = entries.filter(e => e.isFile()).map(e => path.join(seminarsDir, e.name));
  if (!files.length) return 0;

  // Fetch candidate seminars without pictures
  const seminars = await prisma.seminar.findMany({
    where: { OR: [{ picture: null }, { picture: { equals: Buffer.from('') } }] },
    select: { id: true },
    take: files.length,
  });
  if (!seminars.length) return 0;

  let updated = 0;
  for (let i = 0; i < seminars.length; i++) {
    const f = files[i % files.length];
    const img = await loadImage(f);
    if (!img) continue;
    try {
      await prisma.seminar.update({
        where: { id: seminars[i].id },
        data: { picture: img.data, mimeType: img.mimeType },
      });
      updated++;
    } catch {}
  }
  return updated;
}
