import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSeedClassification() {
  try {
    console.log('🔧 Checking for invalid seed classification values...');
    
    // Get all planting reports
    const reports = await prisma.$queryRaw`
      SELECT id, seedClassification 
      FROM planting_reports 
      WHERE seedClassification NOT IN ('Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers')
         OR seedClassification = ''
         OR seedClassification IS NULL
    `;
    
    if (reports.length === 0) {
      console.log('✅ No invalid seed classification values found!');
      return;
    }
    
    console.log(`Found ${reports.length} reports with invalid seed classification values`);
    
    // Update them to a default value
    const result = await prisma.$executeRaw`
      UPDATE planting_reports 
      SET seedClassification = 'Inbred_Good'
      WHERE seedClassification NOT IN ('Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers')
         OR seedClassification = ''
         OR seedClassification IS NULL
    `;
    
    console.log(`✅ Updated ${result} records to default value 'Inbred_Good'`);
    
  } catch (error) {
    console.error('❌ Error fixing seed classification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSeedClassification();
