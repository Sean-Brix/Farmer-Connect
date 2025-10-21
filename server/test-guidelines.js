import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGuidelines() {
  try {
    const count = await prisma.cropGuideline.count();
    console.log('Crop guidelines count:', count);
    
    if (count > 0) {
      const guidelines = await prisma.cropGuideline.findMany({
        select: { id: true, name: true, category: true }
      });
      console.log('Guidelines:', guidelines);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGuidelines();
