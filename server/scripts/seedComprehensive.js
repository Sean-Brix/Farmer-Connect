import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample farmer data
const FARMERS = [
  { name: 'Juan Dela Cruz', location: 'Barangay San Jose, San Fernando, Pampanga', rsbsa: 'RSBSA-01-001-2024-00001' },
  { name: 'Maria Santos', location: 'Barangay Santa Rita, Angeles City, Pampanga', rsbsa: 'RSBSA-01-002-2024-00002' },
  { name: 'Pedro Garcia', location: 'Barangay Balibago, Angeles City, Pampanga', rsbsa: 'RSBSA-01-003-2024-00003' },
  { name: 'Ana Reyes', location: 'Barangay San Nicolas, Mexico, Pampanga', rsbsa: 'RSBSA-01-004-2024-00004' },
  { name: 'Roberto Mendoza', location: 'Barangay Dolores, Mabalacat, Pampanga', rsbsa: 'RSBSA-01-005-2024-00005' },
  { name: 'Carmen Torres', location: 'Barangay Mabiga, Mabalacat, Pampanga', rsbsa: 'RSBSA-01-006-2024-00006' },
  { name: 'Jose Bautista', location: 'Barangay Santo Rosario, Angeles City, Pampanga', rsbsa: 'RSBSA-01-007-2024-00007' },
  { name: 'Rosita Flores', location: 'Barangay Dela Paz, San Fernando, Pampanga', rsbsa: 'RSBSA-01-008-2024-00008' },
  { name: 'Carlos Villanueva', location: 'Barangay Magliman, San Fernando, Pampanga', rsbsa: 'RSBSA-01-009-2024-00009' },
  { name: 'Luisa Ramos', location: 'Barangay Pandacaqui, Mexico, Pampanga', rsbsa: 'RSBSA-01-010-2024-00010' },
  { name: 'Francisco Santiago', location: 'Barangay Cutcut, Angeles City, Pampanga', rsbsa: 'RSBSA-01-011-2024-00011' },
  { name: 'Elena Cruz', location: 'Barangay Saguin, San Fernando, Pampanga', rsbsa: 'RSBSA-01-012-2024-00012' },
  { name: 'Miguel Santos', location: 'Barangay Pulungbulu, Angeles City, Pampanga', rsbsa: 'RSBSA-01-013-2024-00013' },
  { name: 'Teresa Gonzales', location: 'Barangay San Agustin, Mabalacat, Pampanga', rsbsa: 'RSBSA-01-014-2024-00014' },
  { name: 'Antonio Lopez', location: 'Barangay Mawaque, Angeles City, Pampanga', rsbsa: 'RSBSA-01-015-2024-00015' },
];

async function main() {
  console.log('🌾 COMPREHENSIVE PLANTING REPORTS & DISTRIBUTION SEED\n');
  console.log('Creating test data for ALL states and scenarios...\n');

  // Get admin user
  const admin = await prisma.account.findFirst({
    where: { access: { in: ['Admin', 'Super_Admin'] } }
  });

  if (!admin) {
    console.error('❌ No admin user found. Please create an admin account first.');
    process.exit(1);
  }

  // Get user accounts
  const users = await prisma.account.findMany({
    where: { access: 'User' },
    take: 15
  });

  if (users.length < 5) {
    console.error('❌ Not enough user accounts found. Please seed user accounts first.');
    process.exit(1);
  }

  console.log(`✓ Found admin: ${admin.firstName} ${admin.surname}`);
  console.log(`✓ Found ${users.length} user accounts\n`);

  // 1. Setup: Create/Get Seeds, Varieties, Seasons
  await setupMasterData();

  // 2. Clean existing data
  await cleanupExistingData();

  // 3. Create Distribution Requests (ItemTransactions) in ALL states
  const distRequests = await createDistributionRequests(users, admin);

  // 4. Create Planting Reports in ALL states (both standalone and linked to distribution)
  await createPlantingReports(users, admin, distRequests);

  console.log('\n✅ COMPREHENSIVE SEED COMPLETED!\n');
  console.log('📊 Summary:');
  console.log('   - Distribution requests in ALL states (Pending → Harvested)');
  console.log('   - Planting reports in ALL states (Distributed, Planting, Planted, Harvested)');
  console.log('   - Both standalone and distribution-linked reports');
  console.log('   - Archived and deleted reports for testing\n');
}

async function setupMasterData() {
  console.log('📚 Setting up master data...');

  // Create planting seasons
  const seasons = [
    {
      name: 'Wet Season 2024',
      description: 'June to November 2024',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-11-30'),
      isActive: false
    },
    {
      name: 'Dry Season 2025',
      description: 'December 2024 to May 2025',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-05-31'),
      isActive: true
    },
    {
      name: 'Wet Season 2025',
      description: 'June to November 2025',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-11-30'),
      isActive: true
    }
  ];

  for (const season of seasons) {
    await prisma.plantingSeason.upsert({
      where: { name: season.name },
      update: season,
      create: season
    });
  }

  // Create seed varieties
  const varieties = [
    { name: 'NSIC Rc222', cropType: 'Rice', directSeededDAS: 110, transplantedDAS: 115, plantingWindow: 30 },
    { name: 'PSB Rc18', cropType: 'Rice', directSeededDAS: 112, transplantedDAS: 117, plantingWindow: 30 },
    { name: 'NSIC Rc160', cropType: 'Rice', directSeededDAS: 108, transplantedDAS: 113, plantingWindow: 30 },
    { name: 'Pioneer 30G87', cropType: 'Corn', directSeededDAS: 105, transplantedDAS: 105, plantingWindow: 25 },
    { name: 'Dekalb 6142', cropType: 'Corn', directSeededDAS: 110, transplantedDAS: 110, plantingWindow: 25 },
    { name: 'Sweet Potato - VSP', cropType: 'High_Value_Crops', directSeededDAS: 120, transplantedDAS: 100, plantingWindow: 20 },
  ];

  for (const variety of varieties) {
    await prisma.seedVariety.upsert({
      where: { name_cropType: { name: variety.name, cropType: variety.cropType } },
      update: variety,
      create: variety
    });
  }

  // Create inventory items
  const items = await createInventoryItems(varieties);

  console.log(`✓ Created ${seasons.length} seasons, ${varieties.length} varieties, ${items.length} inventory items`);
}

async function createInventoryItems(varieties) {
  const items = [];
  
  // Get all varieties from database
  const dbVarieties = await prisma.seedVariety.findMany();
  
  for (const dbVariety of dbVarieties) {
    const item = await prisma.inventoryItem.upsert({
      where: { 
        name: `${dbVariety.name} Seeds`
      },
      update: {
        seedVarietyId: dbVariety.id,
        category: 'Seeds',
        description: `Quality ${dbVariety.cropType} seeds`
      },
      create: {
        name: `${dbVariety.name} Seeds`,
        unit: 'kg',
        seedVarietyId: dbVariety.id,
        category: 'Seeds',
        description: `Quality ${dbVariety.cropType} seeds`
      }
    });

    // Create item stack
    await prisma.itemStack.upsert({
      where: {
        id: `stack-${item.id}-distributed`
      },
      update: {
        quantity: 1000,
      },
      create: {
        id: `stack-${item.id}-distributed`,
        itemId: item.id,
        quantity: 1000,
        status: 'Distributed',
        createdAt: new Date()
      }
    });

    items.push(item);
  }

  return items;
}

async function cleanupExistingData() {
  console.log('\n🗑️  Cleaning existing data...');
  
  const delReports = await prisma.plantingReport.deleteMany({});
  const delTransactions = await prisma.itemTransaction.deleteMany({});
  
  console.log(`✓ Deleted ${delReports.count} planting reports, ${delTransactions.count} transactions`);
}

async function createDistributionRequests(users, admin) {
  console.log('\n📦 Creating distribution requests in ALL states...');

  const items = await prisma.inventoryItem.findMany({
    include: { seedVariety: true }
  });

  const stacks = await prisma.itemStack.findMany({
    where: { status: 'Distributed' }
  });

  const distRequests = [];

  // Helper to create request
  const createRequest = async (user, item, stack, status, daysOffset, options = {}) => {
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + daysOffset);

    const data = {
      itemStackId: stack.id,
      accountId: user.id,
      adminId: status !== 'Pending' ? admin.id : null,
      quantity: options.quantity || 50,
      status,
      pickupDate,
      requestNote: options.note || `Test request - ${status}`,
      createdAt: new Date(Date.now() - Math.abs(daysOffset) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      farmLocation: options.farmLocation || user.farmLocation || FARMERS[distRequests.length % FARMERS.length].location,
      areaPlanted: options.areaPlanted || 2.5,
      plantingMethod: options.plantingMethod || 'Direct_Seeded',
      plantingReportRequired: true,
      ...options.extra
    };

    if (['Picked_Up', 'late_pickup', 'Planted', 'Harvested'].includes(status)) {
      data.actual_pickup = new Date(pickupDate);
      data.plantingReportDeadline = new Date(pickupDate);
      data.plantingReportDeadline.setDate(data.plantingReportDeadline.getDate() + 30);
    }

    const request = await prisma.itemTransaction.create({ data });
    distRequests.push({ ...request, item, stack });
    return request;
  };

  // Create requests in each state (using modulo to cycle through items/stacks)
  const itemCount = items.length;
  const stackCount = stacks.length;
  
  await createRequest(users[0], items[0 % itemCount], stacks[0 % stackCount], 'Pending', 5, { note: 'Pending approval - just submitted' });
  await createRequest(users[1], items[1 % itemCount], stacks[1 % stackCount], 'Approved', 3, { note: 'Approved - ready for pickup' });
  await createRequest(users[2], items[2 % itemCount], stacks[2 % stackCount], 'Picked_Up', -2, { note: 'Seeds picked up - planting report pending' });
  await createRequest(users[3], items[3 % itemCount], stacks[0 % stackCount], 'late_pickup', -5, { note: 'Late pickup - deadline extended' });
  await createRequest(users[4], items[0 % itemCount], stacks[1 % stackCount], 'Planted', -30, { note: 'Planted - awaiting harvest' });
  
  // Use more users if available, otherwise reuse
  if (users.length >= 10) {
    await createRequest(users[5], items[1 % itemCount], stacks[2 % stackCount], 'Planted', -120, { note: 'Planted - growing' });
    await createRequest(users[6], items[2 % itemCount], stacks[0 % stackCount], 'Rejected', -1, { note: 'Insufficient stock' });
    await createRequest(users[7], items[3 % itemCount], stacks[1 % stackCount], 'No_Pickup', -10, { note: 'Farmer did not pickup' });
    await createRequest(users[8], items[0 % itemCount], stacks[2 % stackCount], 'Cancelled', -3, { note: 'Cancelled by farmer' });
    await createRequest(users[9], items[1 % itemCount], stacks[0 % stackCount], 'Archived', -180, { note: 'Completed and archived' });
  } else {
    // Reuse users
    await createRequest(users[0], items[1 % itemCount], stacks[2 % stackCount], 'Planted', -120, { note: 'Planted - growing' });
    await createRequest(users[1], items[2 % itemCount], stacks[0 % stackCount], 'Rejected', -1, { note: 'Insufficient stock' });
    await createRequest(users[2], items[3 % itemCount], stacks[1 % stackCount], 'No_Pickup', -10, { note: 'Farmer did not pickup' });
    await createRequest(users[3], items[0 % itemCount], stacks[2 % stackCount], 'Cancelled', -3, { note: 'Cancelled by farmer' });
    await createRequest(users[4], items[1 % itemCount], stacks[0 % stackCount], 'Archived', -180, { note: 'Completed and archived' });
  }

  console.log(`✓ Created ${distRequests.length} distribution requests across all states`);
  return distRequests;
}

async function createPlantingReports(users, admin, distRequests) {
  console.log('\n🌱 Creating planting reports in ALL states...');

  const varieties = await prisma.seedVariety.findMany();
  const seasons = await prisma.plantingSeason.findMany();
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];

  const reports = [];
  let farmerIndex = 0;

  const createReport = async (state, linkedDist = null, options = {}) => {
    const farmer = FARMERS[farmerIndex % FARMERS.length];
    farmerIndex++;

    const variety = varieties[farmerIndex % varieties.length];
    const now = new Date();
    
    const baseData = {
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason.id,
      areaPlanted: options.areaPlanted || 2.5,
      seedClassification: options.seedClass || 'Inbred_Certified',
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? 'Irrigated' : null,
      varietyId: variety.id,
      cropInsurance: options.insurance || false,
      state,
      lastUpdatedBy: admin.id,
      isArchived: options.isArchived || false,
      isDeleted: options.isDeleted || false,
      deletedAt: options.isDeleted ? new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) : null,
      archivedAt: options.isArchived ? new Date() : null,
    };

    // Add distribution linkage if provided
    if (linkedDist) {
      baseData.distributionRequestId = linkedDist.id;
      baseData.distributionItemId = linkedDist.itemStackId;
      baseData.distributionQuantity = linkedDist.quantity;
      baseData.distributionUnit = 'kg';
      baseData.distributionPickupDate = linkedDist.actual_pickup || linkedDist.pickupDate;
      baseData.requestNote = linkedDist.requestNote;
      baseData.plantingReportDeadline = linkedDist.plantingReportDeadline;
    }

    // State-specific data
    if (state === 'Distributed' || state === 'Planting') {
      // No planting data yet
      baseData.dateOfPlanting = null;
      baseData.plantingMethod = null;
      baseData.dateOfExpectedHarvest = null;
    }

    if (state === 'Planted' || state === 'Harvested') {
      // Has planting data
      const plantingDate = new Date(now);
      plantingDate.setDate(plantingDate.getDate() - 45);
      baseData.dateOfPlanting = plantingDate;
      baseData.plantingMethod = options.plantingMethod || 'Direct_Seeded';
      
      const expectedHarvest = new Date(plantingDate);
      expectedHarvest.setDate(expectedHarvest.getDate() + (variety.directSeededDAS || 110));
      baseData.dateOfExpectedHarvest = expectedHarvest;
    }

    if (state === 'Harvested') {
      // Has harvest data
      baseData.harvestArea = baseData.areaPlanted * 0.95; // 95% harvest efficiency
      baseData.numberOfBags = 50;
      baseData.weightPerBag = 50;
      baseData.yieldMtPerHa = (50 * 50) / (baseData.harvestArea * 1000); // Mt/Ha
    }

    const report = await prisma.plantingReport.create({ data: baseData });
    reports.push(report);
    return report;
  };

  // DISTRIBUTED STATE (from distribution)
  console.log('   Creating Distributed reports...');
  await createReport('Distributed', distRequests.find(d => d.status === 'Picked_Up'));
  await createReport('Distributed', distRequests.find(d => d.status === 'late_pickup'));

  // PLANTING STATE (manual creation)
  console.log('   Creating Planting reports...');
  await createReport('Planting', null, { seedClass: 'Hybrid_F1' });
  await createReport('Planting', null, { seedClass: 'Inbred_Good' });

  // PLANTED STATE (both types)
  console.log('   Creating Planted reports...');
  await createReport('Planted', distRequests.find(d => d.status === 'Planted'));
  await createReport('Planted', null, { plantingMethod: 'Transplanting' });
  await createReport('Planted', null, { insurance: true, areaPlanted: 3.0 });

  // HARVESTED STATE (both types)
  console.log('   Creating Harvested reports...');
  await createReport('Harvested', distRequests.find(d => d.status === 'Harvested'));
  await createReport('Harvested', null, { areaPlanted: 4.0 });
  await createReport('Harvested', null, { insurance: true });

  // ARCHIVED REPORTS
  console.log('   Creating Archived reports...');
  await createReport('Harvested', null, { isArchived: true, areaPlanted: 2.0 });
  await createReport('Harvested', distRequests.find(d => d.status === 'Archived'), { isArchived: true });

  // DELETED REPORTS (soft delete)
  console.log('   Creating Deleted reports...');
  await createReport('Planted', null, { isDeleted: true });
  await createReport('Distributed', null, { isDeleted: true });

  console.log(`✓ Created ${reports.length} planting reports across all states`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
