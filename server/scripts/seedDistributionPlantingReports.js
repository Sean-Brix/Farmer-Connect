import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample farmer names and locations
const FARMERS = [
  { name: 'Juan Dela Cruz', location: 'Barangay San Jose, San Fernando, Pampanga', rsbsa: 'RSBSA-01-001-2024-00001' },
  { name: 'Maria Santos', location: 'Barangay Santa Rita, Angeles City, Pampanga', rsbsa: 'RSBSA-01-002-2024-00002' },
  { name: 'Pedro Garcia', location: 'Barangay Balibago, Angeles City, Pampanga', rsbsa: 'RSBSA-01-003-2024-00003' },
  { name: 'Ana Reyes', location: 'Barangay San Nicolas, Mexico, Pampanga', rsbsa: 'RSBSA-01-004-2024-00004' },
  { name: 'Roberto Mendoza', location: 'Barangay Dolores, Mabalacat, Pampanga', rsbsa: 'RSBSA-01-005-2024-00005' },
  { name: 'Carmen Torres', location: 'Barangay Mabiga, Mabalacat, Pampanga', rsbsa: 'RSBSA-01-006-2024-00006' },
  { name: 'Jose Bautista', location: 'Barangay Santo Rosario, Angeles City, Pampanga', rsbsa: 'RSBSA-01-007-2024-00007' },
  { name: 'Rosita Flores', location: 'Barangay Dela Paz, San Fernando, Pampanga', rsbsa: 'RSBSA-01-008-2024-00008' },
  { name: 'Carlos Villanueva', location: 'Barangay Magliman, City of San Fernando, Pampanga', rsbsa: 'RSBSA-01-009-2024-00009' },
  { name: 'Luisa Ramos', location: 'Barangay Pandacaqui, Mexico, Pampanga', rsbsa: 'RSBSA-01-010-2024-00010' },
  { name: 'Francisco Santiago', location: 'Barangay Cutcut, Angeles City, Pampanga', rsbsa: 'RSBSA-01-011-2024-00011' },
  { name: 'Elena Cruz', location: 'Barangay Saguin, San Fernando, Pampanga', rsbsa: 'RSBSA-01-012-2024-00012' },
  { name: 'Miguel Santos', location: 'Barangay Pulungbulu, Angeles City, Pampanga', rsbsa: 'RSBSA-01-013-2024-00013' },
  { name: 'Teresa Gonzales', location: 'Barangay San Agustin, Mabalacat, Pampanga', rsbsa: 'RSBSA-01-014-2024-00014' },
  { name: 'Antonio Lopez', location: 'Barangay Mawaque, Angeles City, Pampanga', rsbsa: 'RSBSA-01-015-2024-00015' },
  { name: 'Sandra Cruz', location: 'Barangay Telabastagan, San Fernando, Pampanga', rsbsa: 'RSBSA-01-016-2024-00016' },
  { name: 'Ricardo Diaz', location: 'Barangay Anunas, Angeles City, Pampanga', rsbsa: 'RSBSA-01-017-2024-00017' },
  { name: 'Margarita Luna', location: 'Barangay Sto. Cristo, San Fernando, Pampanga', rsbsa: 'RSBSA-01-018-2024-00018' },
];

async function cleanupExistingData() {
  console.log('🧹 Cleaning up existing data...\n');
  
  // Delete in correct order due to foreign key constraints
  await prisma.plantingReport.deleteMany({});
  await prisma.itemTransaction.deleteMany({});
  await prisma.itemStack.deleteMany({});
  
  console.log('✓ Cleaned up planting reports and distribution requests\n');
}

async function createDistributionRequests() {
  console.log('📦 Creating distribution requests...\n');
  
  // Get existing users, items, and seed varieties
  const users = await prisma.account.findMany({ where: { access: 'User' }, take: 18 });
  const items = await prisma.inventoryItem.findMany({ where: { seedVarietyId: { not: null } }, take: 10 });
  const admin = await prisma.account.findFirst({ where: { access: 'Admin' } });
  
  if (users.length === 0 || items.length === 0) {
    throw new Error('❌ Need users and seed items in database first!');
  }
  
  // Create distribution stacks for each item
  const stacks = [];
  for (const item of items) {
    const stack = await prisma.itemStack.create({
      data: {
        itemId: item.id,
        quantity: 500,
        status: 'Distributed',
        date_limit: null // No date limit for distribution stacks
      }
    });
    stacks.push(stack);
  }
  
  console.log(`✓ Created ${stacks.length} distribution stacks\n`);
  
  const requests = [];
  let userIndex = 0;
  
  // State 1: Distributed/Planting - 5 requests (Picked_Up status)
  for (let i = 0; i < 5; i++) {
    const user = users[userIndex % users.length];
    const stack = stacks[i % stacks.length];
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() - (7 + i)); // Picked up 7+ days ago
    
    const request = await prisma.itemTransaction.create({
      data: {
        itemStackId: stack.id,
        accountId: user.id,
        adminId: admin?.id,
        quantity: 25 + (i * 5),
        status: 'Picked_Up',
        pickupDate: new Date(),
        actual_pickup: pickupDate,
        requestNote: `Distribution for ${FARMERS[userIndex].name}`,
        farmLocation: FARMERS[userIndex].location,
        areaPlanted: 1.5 + (i * 0.5),
        plantingMethod: i % 2 === 0 ? 'Transplanting' : 'Direct_Seeded'
      }
    });
    requests.push(request);
    userIndex++;
  }
  
  // State 2: Planted - 6 requests (Planted status)
  for (let i = 0; i < 6; i++) {
    const user = users[userIndex % users.length];
    const stack = stacks[i % stacks.length];
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() - (20 + i)); // Picked up 20+ days ago
    
    const request = await prisma.itemTransaction.create({
      data: {
        itemStackId: stack.id,
        accountId: user.id,
        adminId: admin?.id,
        quantity: 30 + (i * 5),
        status: 'Planted',
        pickupDate: new Date(),
        actual_pickup: pickupDate,
        requestNote: `Planted seeds for ${FARMERS[userIndex].name}`,
        farmLocation: FARMERS[userIndex].location,
        areaPlanted: 2.0 + (i * 0.3),
        plantingMethod: i % 2 === 0 ? 'Transplanting' : 'Direct_Seeded'
      }
    });
    requests.push(request);
    userIndex++;
  }
  
  // State 3: Harvested - 4 requests (Planted status, but reports will be Harvested)
  for (let i = 0; i < 4; i++) {
    const user = users[userIndex % users.length];
    const stack = stacks[i % stacks.length];
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() - (90 + i)); // Picked up 90+ days ago
    
    const request = await prisma.itemTransaction.create({
      data: {
        itemStackId: stack.id,
        accountId: user.id,
        adminId: admin?.id,
        quantity: 35 + (i * 5),
        status: 'Planted',
        pickupDate: new Date(),
        actual_pickup: pickupDate,
        requestNote: `Harvested crop for ${FARMERS[userIndex].name}`,
        farmLocation: FARMERS[userIndex].location,
        areaPlanted: 2.5 + (i * 0.4),
        plantingMethod: 'Transplanting'
      }
    });
    requests.push(request);
    userIndex++;
  }
  
  console.log(`✓ Created ${requests.length} distribution requests (5 Distributed, 6 Planted, 4 for Harvested)\n`);
  
  return requests;
}

async function createPlantingReports(distributionRequests) {
  console.log('🌱 Creating planting reports...\n');
  
  const seasons = await prisma.plantingSeason.findMany();
  const varieties = await prisma.seedVariety.findMany();
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  
  if (!activeSeason || varieties.length === 0) {
    throw new Error('❌ Need active season and varieties in database first!');
  }
  
  const riceVarieties = varieties.filter(v => v.cropType === 'Rice');
  const cornVarieties = varieties.filter(v => v.cropType === 'Corn');
  
  const reports = [];
  let farmerIndex = 0;
  
  // ============ STATE 1: DISTRIBUTED/PLANTING - 5 reports ============
  console.log('Creating Distributed/Planting reports (5)...');
  for (let i = 0; i < 5; i++) {
    const request = distributionRequests[i];
    const variety = i % 2 === 0 ? riceVarieties[i % riceVarieties.length] : cornVarieties[i % cornVarieties.length];
    const farmer = FARMERS[farmerIndex++];
    const plantingDate = new Date();
    plantingDate.setDate(plantingDate.getDate() + (5 + i)); // Will plant in 5+ days
    
    const report = await prisma.plantingReport.create({
      data: {
        farmerName: farmer.name,
        farmLocation: farmer.location,
        rsbsaNumber: farmer.rsbsa,
        croppingSeasonId: activeSeason.id,
        areaPlanted: request.areaPlanted,
        seedClassification: 'Inbred_Certified',
        typeOfCrop: variety.cropType,
        riceIrrigation: variety.cropType === 'Rice' ? 'Irrigated' : null,
        varietyId: variety.id,
        dateOfPlanting: plantingDate,
        plantingMethod: request.plantingMethod,
        cropInsurance: i % 3 === 0,
        state: 'Distributed',
        distributedQuantity: request.quantity,
        distributionRequestId: request.id,
        distributionItemId: request.itemStackId,
        distributionQuantity: request.quantity,
        distributionUnit: 'kg',
        distributionPickupDate: request.actual_pickup,
        requestNote: request.requestNote,
        plantingReportDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        lastUpdatedBy: 'admin',
        isArchived: false,
        isDeleted: false,
        stateHistory: JSON.stringify([{
          state: 'Distributed',
          timestamp: request.actual_pickup,
          by: 'admin',
          note: 'Seeds distributed - awaiting planting'
        }])
      }
    });
    
    // Link report to request
    await prisma.itemTransaction.update({
      where: { id: request.id },
      data: { plantingReportId: report.id }
    });
    
    reports.push(report);
  }
  console.log(`✓ Created 5 Distributed/Planting reports\n`);
  
  // ============ STATE 2: PLANTED - 6 reports ============
  console.log('Creating Planted reports (6)...');
  for (let i = 5; i < 11; i++) {
    const request = distributionRequests[i];
    const variety = i % 2 === 0 ? riceVarieties[i % riceVarieties.length] : cornVarieties[i % cornVarieties.length];
    const farmer = FARMERS[farmerIndex++];
    const plantingDate = new Date();
    plantingDate.setDate(plantingDate.getDate() - (15 + (i * 2))); // Planted 15+ days ago
    
    const expectedHarvestDate = new Date(plantingDate);
    const daysToAdd = request.plantingMethod === 'Transplanting' 
      ? variety.transplantedDAS 
      : variety.directSeededDAS;
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + daysToAdd);
    
    const report = await prisma.plantingReport.create({
      data: {
        farmerName: farmer.name,
        farmLocation: farmer.location,
        rsbsaNumber: farmer.rsbsa,
        croppingSeasonId: activeSeason.id,
        areaPlanted: request.areaPlanted,
        seedClassification: 'Inbred_Certified',
        typeOfCrop: variety.cropType,
        riceIrrigation: variety.cropType === 'Rice' ? (i % 2 === 0 ? 'Irrigated' : 'RainfedLowland') : null,
        varietyId: variety.id,
        dateOfPlanting: plantingDate,
        dateOfExpectedHarvest: expectedHarvestDate,
        plantingMethod: request.plantingMethod,
        cropInsurance: i % 2 === 0,
        state: 'Planted',
        distributedQuantity: request.quantity,
        distributionRequestId: request.id,
        distributionItemId: request.itemStackId,
        distributionQuantity: request.quantity,
        distributionUnit: 'kg',
        distributionPickupDate: request.actual_pickup,
        requestNote: request.requestNote,
        lastUpdatedBy: 'admin',
        isArchived: false,
        isDeleted: false,
        stateHistory: JSON.stringify([
          {
            state: 'Distributed',
            timestamp: request.actual_pickup,
            by: 'admin',
            note: 'Seeds distributed'
          },
          {
            state: 'Planted',
            timestamp: plantingDate,
            by: 'admin',
            note: 'Crop successfully planted'
          }
        ])
      }
    });
    
    // Link report to request
    await prisma.itemTransaction.update({
      where: { id: request.id },
      data: { plantingReportId: report.id }
    });
    
    reports.push(report);
  }
  console.log(`✓ Created 6 Planted reports\n`);
  
  // ============ STATE 3: HARVESTED - 4 reports ============
  console.log('Creating Harvested reports (4)...');
  for (let i = 11; i < 15; i++) {
    const request = distributionRequests[i];
    const variety = i % 2 === 0 ? riceVarieties[i % riceVarieties.length] : cornVarieties[i % cornVarieties.length];
    const farmer = FARMERS[farmerIndex++];
    const plantingDate = new Date();
    plantingDate.setDate(plantingDate.getDate() - (90 + (i * 5))); // Planted 90+ days ago
    
    const expectedHarvestDate = new Date(plantingDate);
    const daysToAdd = request.plantingMethod === 'Transplanting' 
      ? variety.transplantedDAS 
      : variety.directSeededDAS;
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + daysToAdd);
    
    const harvestArea = request.areaPlanted;
    const numberOfBags = Math.floor(harvestArea * (30 + (i * 3)));
    const weightPerBag = 50;
    const yieldMtPerHa = (numberOfBags * weightPerBag) / (harvestArea * 1000);
    
    const report = await prisma.plantingReport.create({
      data: {
        farmerName: farmer.name,
        farmLocation: farmer.location,
        rsbsaNumber: farmer.rsbsa,
        croppingSeasonId: activeSeason.id,
        areaPlanted: request.areaPlanted,
        seedClassification: 'Inbred_Certified',
        typeOfCrop: variety.cropType,
        riceIrrigation: variety.cropType === 'Rice' ? 'Irrigated' : null,
        varietyId: variety.id,
        dateOfPlanting: plantingDate,
        dateOfExpectedHarvest: expectedHarvestDate,
        plantingMethod: request.plantingMethod,
        cropInsurance: true,
        harvestArea: harvestArea,
        numberOfBags: numberOfBags,
        weightPerBag: weightPerBag,
        yieldMtPerHa: yieldMtPerHa,
        state: 'Harvested',
        distributedQuantity: request.quantity,
        distributionRequestId: request.id,
        distributionItemId: request.itemStackId,
        distributionQuantity: request.quantity,
        distributionUnit: 'kg',
        distributionPickupDate: request.actual_pickup,
        requestNote: request.requestNote,
        lastUpdatedBy: 'admin',
        isArchived: false,
        isDeleted: false,
        stateHistory: JSON.stringify([
          {
            state: 'Distributed',
            timestamp: request.actual_pickup,
            by: 'admin',
            note: 'Seeds distributed'
          },
          {
            state: 'Planted',
            timestamp: plantingDate,
            by: 'admin',
            note: 'Crop successfully planted'
          },
          {
            state: 'Harvested',
            timestamp: expectedHarvestDate,
            by: 'admin',
            note: 'Crop harvested successfully'
          }
        ])
      }
    });
    
    // Link report to request
    await prisma.itemTransaction.update({
      where: { id: request.id },
      data: { plantingReportId: report.id }
    });
    
    reports.push(report);
  }
  console.log(`✓ Created 4 Harvested reports\n`);
  
  console.log(`\n📊 Summary:`);
  console.log(`   - Distributed/Planting: 5 reports`);
  console.log(`   - Planted: 6 reports`);
  console.log(`   - Harvested: 4 reports`);
  console.log(`   - Total: ${reports.length} planting reports\n`);
  
  return reports;
}

async function main() {
  try {
    console.log('🌾 Starting Distribution & Planting Reports Seed...\n');

    await cleanupExistingData();
    const distributionRequests = await createDistributionRequests();
    await createPlantingReports(distributionRequests);

    console.log('✅ Seed completed successfully!');
    console.log('\n📌 You can now view:');
    console.log('   - Distribution page: 5 Distributed, 6 Planted, 4 Harvested');
    console.log('   - Planting Reports page: Same 15 reports\n');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
