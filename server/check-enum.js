import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkEnum() {
  const result = await prisma.$queryRaw`SHOW COLUMNS FROM planting_reports LIKE 'seedClassification'`;
  console.log(JSON.stringify(result, null, 2));
  await prisma.$disconnect();
}

checkEnum();
