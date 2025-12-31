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
];

async function cleanupExistingReports() {
  console.log('Cleaning up existing planting reports...');
  
  const deleteResult = await prisma.plantingReport.deleteMany({});
  console.log(`✓ Deleted ${deleteResult.count} existing planting reports\n`);
}

async function createPlantingSeasons() {
  console.log('Creating planting seasons...');
  
  const seasons = [
    {
      name: 'Wet Season 2024',
      description: 'June to November 2024 planting season',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-11-30'),
      isActive: false
    },
    {
      name: 'Dry Season 2025',
      description: 'December 2024 to May 2025 planting season',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-05-31'),
      isActive: true
    },
    {
      name: 'Wet Season 2025',
      description: 'June to November 2025 planting season',
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

  console.log(`✓ Created ${seasons.length} planting seasons`);
}

async function createSeedVarieties() {
  console.log('Creating seed varieties...');
  
  const varieties = [
    // Rice varieties
    { name: 'NSIC Rc222', cropType: 'Rice', directSeededDAS: 110, transplantedDAS: 115, description: 'High-yielding inbred rice variety', plantingWindow: 30 },
    { name: 'PSB Rc18', cropType: 'Rice', directSeededDAS: 112, transplantedDAS: 117, description: 'Aromatic rice variety', plantingWindow: 30 },
    { name: 'NSIC Rc160', cropType: 'Rice', directSeededDAS: 108, transplantedDAS: 113, description: 'Drought-tolerant rice', plantingWindow: 30 },
    { name: 'PSB Rc10', cropType: 'Rice', directSeededDAS: 115, transplantedDAS: 120, description: 'Traditional rice variety', plantingWindow: 30 },
    
    // Corn varieties
    { name: 'Pioneer 30G87', cropType: 'Corn', directSeededDAS: 105, transplantedDAS: 105, description: 'High-yielding hybrid corn', plantingWindow: 25 },
    { name: 'Dekalb 6142', cropType: 'Corn', directSeededDAS: 110, transplantedDAS: 110, description: 'Drought-resistant corn variety', plantingWindow: 25 },
    { name: 'NK 6410', cropType: 'Corn', directSeededDAS: 108, transplantedDAS: 108, description: 'Early maturing corn', plantingWindow: 25 },
    
    // High Value Crops
    { name: 'Sweet Potato - VSP', cropType: 'High_Value_Crops', directSeededDAS: 120, transplantedDAS: 100, description: 'Vitamin-A sweet potato', plantingWindow: 20 },
    { name: 'Tomato - Diamante Max', cropType: 'High_Value_Crops', directSeededDAS: 85, transplantedDAS: 75, description: 'Disease-resistant tomato', plantingWindow: 15 },
    { name: 'Eggplant - Mara', cropType: 'High_Value_Crops', directSeededDAS: 90, transplantedDAS: 80, description: 'High-yielding eggplant', plantingWindow: 15 }
  ];

  for (const variety of varieties) {
    await prisma.seedVariety.upsert({
      where: { 
        name_cropType: {
          name: variety.name,
          cropType: variety.cropType
        }
      },
      update: variety,
      create: variety
    });
  }

  console.log(`✓ Created ${varieties.length} seed varieties`);
}

async function createPlantingReports() {
  console.log('Creating planting reports...');
  
  // ============================================================================
  // THREE-STATE SYSTEM FOR PLANTING REPORTS (Updated Dec 2025)
  // ============================================================================
  // 
  // State 1: Planting (Previously "Request_Report" or "Distributed")
  //   - Seeds distributed or allocated, NOT planted yet
  //   - Required: farmerName, farmLocation, areaPlanted, typeOfCrop, varietyId,
  //               croppingSeasonId, seedClassification, dateOfPlanting, plantingMethod
  //   - Rice requires: riceIrrigation
  //   - Excluded: All harvest fields (harvestArea, numberOfBags, weightPerBag)
  //   - Optional: distributionRequestId (if from distribution)
  // 
  // State 2: Planted
  //   - Crop has been planted, NOT harvested yet
  //   - Required: All from Planting state
  //   - Locked: farmerName, farmLocation, areaPlanted, typeOfCrop, varietyId,
  //             croppingSeasonId, seedClassification
  //   - Editable: dateOfPlanting, plantingMethod, riceIrrigation
  //   - Auto-calculated: dateOfExpectedHarvest (based on variety DAS)
  //   - Excluded: All harvest fields
  // 
  // State 3: Harvested (Previously "Completed")
  //   - Crop has been harvested, all data complete
  //   - Required: All from Planted state + harvestArea, numberOfBags, weightPerBag
  //   - Locked: All planting fields
  //   - Editable: Only harvest fields
  //   - Auto-calculated: yieldMtPerHa
  //   - Ready for archive (manual admin action)
  // 
  // Additional Flags:
  //   - isArchived: Only available when state = Harvested
  //   - isDeleted: Soft delete with 30-day recovery period
  // ============================================================================
  
  // Get existing data
  const seasons = await prisma.plantingSeason.findMany();
  const varieties = await prisma.seedVariety.findMany();
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  
  // Get distribution requests to link some planting reports
  const distributionRequests = await prisma.itemTransaction.findMany({
    where: {
      itemStack: {
        status: 'Distributed'  // Filter by stack status, not transaction type
      },
      status: {
        in: ['Picked_Up', 'Planted', 'late_pickup']
      }
    },
    include: {
      itemStack: {
        include: {
          item: {
            include: {
              seedVariety: true
            }
          }
        }
      }
    },
    take: 10
  });

  console.log(`📦 Found ${distributionRequests.length} distribution requests to link`);
  
  // Get variety IDs by crop type
  const riceVarieties = varieties.filter(v => v.cropType === 'Rice');
  const cornVarieties = varieties.filter(v => v.cropType === 'Corn');
  const hvcVarieties = varieties.filter(v => v.cropType === 'High_Value_Crops');
  
  const reports = [];
  
  // ============ PLANTING REPORTS (State 1) - 10 reports ============
  // These are newly distributed seeds, preparing to plant
  // All required fields for Planting state MUST be filled
  
  // Helper to get distribution request for linking
  let distReqIndex = 0;
  const getDistributionLink = () => {
    if (distReqIndex < distributionRequests.length) {
      const req = distributionRequests[distReqIndex];
      distReqIndex++;
      return {
        distributionRequestId: req.id,
        distributionItemId: req.itemId,
        distributionQuantity: req.quantity,
        distributionPickupDate: req.actual_pickup_date || req.created_at
      };
    }
    return {
      distributionRequestId: null,
      distributionItemId: null,
      distributionQuantity: null,
      distributionPickupDate: null
    };
  };
  
  // Rice Planting Reports
  const dist1 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[0].name,
    farmLocation: FARMERS[0].location,
    rsbsaNumber: FARMERS[0].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[0]?.id,
    dateOfPlanting: new Date('2025-01-05'),  // REQUIRED in Planting state
    plantingMethod: 'Transplanting',  // REQUIRED in Planting state
    cropInsurance: true,
    state: 'Planting',
    distributedQuantity: dist1.distributionQuantity || 50,
    lastUpdatedBy: 'admin',
    distributionRequestId: dist1.distributionRequestId,
    distributionItemId: dist1.distributionItemId,
    distributionQuantity: dist1.distributionQuantity || 50,
    distributionUnit: 'kg',
    distributionPickupDate: dist1.distributionPickupDate,
    requestNote: 'Seeds distributed - planting report required',
    plantingReportDeadline: new Date('2025-01-20'),
    isArchived: false,
    isDeleted: false,
    stateHistory: JSON.stringify([{
      state: 'Planting',
      timestamp: new Date('2024-12-20'),
      by: 'admin',
      note: 'Initial seed distribution'
    }])
  });

  const dist2 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[1].name,
    farmLocation: FARMERS[1].location,
    rsbsaNumber: FARMERS[1].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 1.8,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'RainfedLowland',
    varietyId: riceVarieties[1]?.id,
    dateOfPlanting: new Date('2025-01-08'),  // REQUIRED in Planting state
    plantingMethod: 'Direct_Seeded',  // REQUIRED in Planting state
    cropInsurance: false,
    state: 'Planting',
    distributedQuantity: dist2.distributionQuantity || 35,
    lastUpdatedBy: 'admin',
    distributionRequestId: dist2.distributionRequestId,
    distributionItemId: dist2.distributionItemId,
    distributionQuantity: dist2.distributionQuantity || 35,
    distributionUnit: 'kg',
    distributionPickupDate: dist2.distributionPickupDate,
    requestNote: 'Priority distribution for wet season',
    plantingReportDeadline: new Date('2025-01-25'),
    isArchived: false,
    isDeleted: false
  });

  // Corn Planting Reports
  const dist3 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[2].name,
    farmLocation: FARMERS[2].location,
    rsbsaNumber: FARMERS[2].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 3.0,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[0]?.id,
    dateOfPlanting: new Date('2025-01-10'),  // REQUIRED in Planting state
    plantingMethod: 'Direct_Seeded',  // REQUIRED in Planting state
    cropInsurance: true,
    state: 'Planting',
    distributionRequestId: dist3.distributionRequestId,
    distributionItemId: dist3.distributionItemId,
    distributionQuantity: dist3.distributionQuantity || 25,
    distributionUnit: 'kg',
    distributionPickupDate: dist3.distributionPickupDate,
    requestNote: 'High-yield variety for commercial production',
    plantingReportDeadline: new Date('2025-01-15'),
    isArchived: false,
    isDeleted: false
  });

  const dist4 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[3].name,
    farmLocation: FARMERS[3].location,
    rsbsaNumber: FARMERS[3].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.2,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[1]?.id,
    dateOfPlanting: new Date('2025-01-12'),  // REQUIRED in Planting state
    plantingMethod: 'Direct_Seeded',  // REQUIRED in Planting state
    cropInsurance: false,
    state: 'Planting',
    distributionRequestId: dist4.distributionRequestId,
    distributionItemId: dist4.distributionItemId,
    distributionQuantity: dist4.distributionQuantity || 18,
    distributionUnit: 'kg',
    distributionPickupDate: dist4.distributionPickupDate,
    isArchived: false,
    isDeleted: false
  });

  // HVC Planting Reports
  const dist5 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[4].name,
    farmLocation: FARMERS[4].location,
    rsbsaNumber: FARMERS[4].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[0]?.id,
    dateOfPlanting: new Date('2025-01-06'),  // REQUIRED in Planting state
    plantingMethod: 'Transplanting',  // REQUIRED in Planting state
    cropInsurance: true,
    state: 'Planting',
    distributionRequestId: dist5.distributionRequestId,
    distributionItemId: dist5.distributionItemId,
    distributionQuantity: dist5.distributionQuantity || 500,
    distributionUnit: 'seedlings',
    distributionPickupDate: dist5.distributionPickupDate,
    requestNote: 'Sweet potato planting material',
    plantingReportDeadline: new Date('2025-01-10'),
    isArchived: false,
    isDeleted: false
  });

  const dist6 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[5].name,
    farmLocation: FARMERS[5].location,
    rsbsaNumber: FARMERS[5].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.8,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[1]?.id,
    dateOfPlanting: new Date('2025-01-09'),  // REQUIRED in Planting state
    plantingMethod: 'Transplanting',  // REQUIRED in Planting state
    cropInsurance: false,
    state: 'Planting',
    distributionRequestId: dist6.distributionRequestId,
    distributionItemId: dist6.distributionItemId,
    distributionQuantity: dist6.distributionQuantity || 300,
    distributionUnit: 'seedlings',
    distributionPickupDate: dist6.distributionPickupDate,
    isArchived: false,
    isDeleted: false
  });

  // Additional Planting Reports
  const dist7 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[13].name,
    farmLocation: FARMERS[13].location,
    rsbsaNumber: FARMERS[13].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 1.5,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[2]?.id,
    dateOfPlanting: new Date('2025-01-14'),  // REQUIRED in Planting state
    plantingMethod: 'Transplanting',  // REQUIRED in Planting state
    cropInsurance: true,
    state: 'Planting',
    distributionRequestId: dist7.distributionRequestId,
    distributionItemId: dist7.distributionItemId,
    distributionQuantity: dist7.distributionQuantity || 20,
    distributionUnit: 'kg',
    distributionPickupDate: dist7.distributionPickupDate,
    isArchived: false,
    isDeleted: false
  });

  const dist8 = getDistributionLink();
  reports.push({
    farmerName: FARMERS[14].name,
    farmLocation: FARMERS[14].location,
    rsbsaNumber: FARMERS[14].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.0,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[2]?.id,
    dateOfPlanting: new Date('2025-01-15'),  // REQUIRED in Planting state
    plantingMethod: 'Direct_Seeded',  // REQUIRED in Planting state
    cropInsurance: false,
    state: 'Planting',
    distributionRequestId: dist8.distributionRequestId,
    distributionItemId: dist8.distributionItemId,
    distributionQuantity: dist8.distributionQuantity || 15,
    distributionUnit: 'kg',
    distributionPickupDate: dist8.distributionPickupDate,
    isArchived: false,
    isDeleted: false
  });

  // Additional Planting Reports for comprehensive testing
  reports.push({
    farmerName: 'Angelina Mercado',
    farmLocation: 'Barangay Cutud, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-041-2025-00041',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 1.2,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'RainfedLowland',
    varietyId: riceVarieties[3]?.id,
    dateOfPlanting: new Date('2025-01-16'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Planting',
    distributionQuantity: 24,
    distributionUnit: 'kg',
    lastUpdatedBy: 'admin',
    requestNote: 'Upland rice variety for hillside farming',
    plantingReportDeadline: new Date('2025-01-30'),
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Bartolome Serrano',
    farmLocation: 'Barangay Telabastagan, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-042-2025-00042',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.3,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[2]?.id,
    dateOfPlanting: new Date('2025-01-11'),
    plantingMethod: 'Transplanting',
    cropInsurance: false,
    state: 'Planting',
    distributionQuantity: 200,
    distributionUnit: 'seedlings',
    lastUpdatedBy: 'admin',
    requestNote: 'Eggplant seedlings for backyard garden',
    plantingReportDeadline: new Date('2025-01-22'),
    isArchived: false,
    isDeleted: false
  });

  // ============ PLANTED REPORTS (State 2) - 10 reports ============
  // These crops have been planted but not harvested
  
  // Rice Planted Reports
  reports.push({
    farmerName: FARMERS[6].name,
    farmLocation: FARMERS[6].location,
    rsbsaNumber: FARMERS[6].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 3.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[0]?.id,
    dateOfPlanting: new Date('2024-12-10'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-04-05'),
    distributionQuantity: 70,
    distributionUnit: 'kg',
    isArchived: false,
    isDeleted: false,
    stateHistory: JSON.stringify([
      {
        state: 'Planting',
        timestamp: new Date('2024-11-25'),
        by: 'admin',
        note: 'Seeds distributed'
      },
      {
        state: 'Planted',
        timestamp: new Date('2024-12-10'),
        by: FARMERS[6].name,
        note: 'Transplanting completed'
      }
    ])
  });

  reports.push({
    farmerName: FARMERS[7].name,
    farmLocation: FARMERS[7].location,
    rsbsaNumber: FARMERS[7].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.8,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'RainfedLowland',
    varietyId: riceVarieties[1]?.id,
    dateOfPlanting: new Date('2024-12-05'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-28'),
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: FARMERS[8].name,
    farmLocation: FARMERS[8].location,
    rsbsaNumber: FARMERS[8].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 4.0,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[2]?.id,
    dateOfPlanting: new Date('2024-12-01'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-25'),
    isArchived: false,
    isDeleted: false
  });

  // Corn Planted Reports
  reports.push({
    farmerName: FARMERS[9].name,
    farmLocation: FARMERS[9].location,
    rsbsaNumber: FARMERS[9].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[0]?.id,
    dateOfPlanting: new Date('2024-12-08'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-23'),
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: FARMERS[10].name,
    farmLocation: FARMERS[10].location,
    rsbsaNumber: FARMERS[10].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 3.2,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[1]?.id,
    dateOfPlanting: new Date('2024-12-12'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-04-01'),
    isArchived: false,
    isDeleted: false
  });

  // HVC Planted Reports
  reports.push({
    farmerName: FARMERS[11].name,
    farmLocation: FARMERS[11].location,
    rsbsaNumber: FARMERS[11].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.6,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[0]?.id,
    dateOfPlanting: new Date('2024-12-03'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-04-02'),
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: FARMERS[12].name,
    farmLocation: FARMERS[12].location,
    rsbsaNumber: FARMERS[12].rsbsa,
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.4,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[1]?.id,
    dateOfPlanting: new Date('2024-12-15'),
    plantingMethod: 'Transplanting',
    cropInsurance: false,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-10'),
    isArchived: false,
    isDeleted: false
  });

  // Additional Planted Reports (various crops)
  reports.push({
    farmerName: 'Ricardo Hernandez',
    farmLocation: 'Barangay San Pedro, Magalang, Pampanga',
    rsbsaNumber: 'RSBSA-01-016-2024-00016',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 1.9,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[3]?.id,
    dateOfPlanting: new Date('2024-11-28'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-22'),
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Gloria Martinez',
    farmLocation: 'Barangay Panipuan, Mexico, Pampanga',
    rsbsaNumber: 'RSBSA-01-017-2024-00017',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.1,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[2]?.id,
    dateOfPlanting: new Date('2024-12-06'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-20'),
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Benjamin Aquino',
    farmLocation: 'Barangay Sindalan, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-018-2024-00018',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.7,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[2]?.id,
    dateOfPlanting: new Date('2024-12-18'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-18'),
    isArchived: false,
    isDeleted: false
  });

  // ============ HARVESTED REPORTS (State 3) - 12 reports ============
  // These crops have been harvested with complete data
  
  // Rice Harvested Reports
  reports.push({
    farmerName: 'Alfredo Valencia',
    farmLocation: 'Barangay Santo Cristo, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-019-2024-00019',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 3.0,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[0]?.id,
    dateOfPlanting: new Date('2024-06-15'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-10'),
    harvestArea: 3.0,
    numberOfBags: 120,
    weightPerBag: 50,
    yieldMtPerHa: 2.0,
    isArchived: false,
    isDeleted: false,
    stateHistory: JSON.stringify([
      {
        state: 'Planting',
        timestamp: new Date('2024-05-20'),
        by: 'admin',
        note: 'Seeds distributed'
      },
      {
        state: 'Planted',
        timestamp: new Date('2024-06-15'),
        by: 'Alfredo Valencia',
        note: 'Transplanted in main field'
      },
      {
        state: 'Harvested',
        timestamp: new Date('2024-10-12'),
        by: 'admin',
        note: 'Harvest completed and recorded'
      }
    ])
  });

  reports.push({
    farmerName: 'Diana Pascual',
    farmLocation: 'Barangay Mabiga, Mabalacat, Pampanga',
    rsbsaNumber: 'RSBSA-01-020-2024-00020',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 2.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[1]?.id,
    dateOfPlanting: new Date('2024-06-20'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-15'),
    harvestArea: 2.5,
    numberOfBags: 95,
    weightPerBag: 50,
    yieldMtPerHa: 1.9,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Eduardo Diaz',
    farmLocation: 'Barangay Lourdes, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-021-2024-00021',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 4.2,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'RainfedLowland',
    varietyId: riceVarieties[2]?.id,
    dateOfPlanting: new Date('2024-06-10'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-05'),
    harvestArea: 4.2,
    numberOfBags: 155,
    weightPerBag: 50,
    yieldMtPerHa: 1.85,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Felicidad Navarro',
    farmLocation: 'Barangay San Isidro, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-022-2024-00022',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 1.8,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[3]?.id,
    dateOfPlanting: new Date('2024-07-01'),
    plantingMethod: 'Transplanting',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-25'),
    harvestArea: 1.8,
    numberOfBags: 68,
    weightPerBag: 50,
    yieldMtPerHa: 1.89,
    isArchived: false,
    isDeleted: false
  });

  // Corn Harvested Reports
  reports.push({
    farmerName: 'Gregorio Salazar',
    farmLocation: 'Barangay Claro M. Recto, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-023-2024-00023',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 2.8,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[0]?.id,
    dateOfPlanting: new Date('2024-06-25'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-08'),
    harvestArea: 2.8,
    numberOfBags: 168,
    weightPerBag: 25,
    yieldMtPerHa: 1.5,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Helena Ocampo',
    farmLocation: 'Barangay Culaiat, City of San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-024-2024-00024',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 3.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[1]?.id,
    dateOfPlanting: new Date('2024-07-05'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-23'),
    harvestArea: 3.5,
    numberOfBags: 196,
    weightPerBag: 25,
    yieldMtPerHa: 1.4,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Ignacio Gutierrez',
    farmLocation: 'Barangay Tabun, Mabalacat, Pampanga',
    rsbsaNumber: 'RSBSA-01-025-2024-00025',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 2.3,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[2]?.id,
    dateOfPlanting: new Date('2024-06-18'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-02'),
    harvestArea: 2.3,
    numberOfBags: 115,
    weightPerBag: 25,
    yieldMtPerHa: 1.25,
    isArchived: false,
    isDeleted: false
  });

  // HVC Harvested Reports
  reports.push({
    farmerName: 'Julia Cortez',
    farmLocation: 'Barangay Baliti, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-026-2024-00026',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 0.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[0]?.id,
    dateOfPlanting: new Date('2024-06-28'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-26'),
    harvestArea: 0.5,
    numberOfBags: 50,
    weightPerBag: 10,
    yieldMtPerHa: 1.0,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Leonardo Aguilar',
    farmLocation: 'Barangay San Nicolas, Mexico, Pampanga',
    rsbsaNumber: 'RSBSA-01-027-2024-00027',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 0.7,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[1]?.id,
    dateOfPlanting: new Date('2024-07-10'),
    plantingMethod: 'Transplanting',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-03'),
    harvestArea: 0.7,
    numberOfBags: 280,
    weightPerBag: 5,
    yieldMtPerHa: 2.0,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Monica Estrada',
    farmLocation: 'Barangay Pulung Santol, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-028-2024-00028',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 0.9,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[2]?.id,
    dateOfPlanting: new Date('2024-06-22'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-09-15'),
    harvestArea: 0.9,
    numberOfBags: 450,
    weightPerBag: 3,
    yieldMtPerHa: 1.5,
    isArchived: false,
    isDeleted: false
  });

  // Additional Harvested Reports
  reports.push({
    farmerName: 'Nestor Chavez',
    farmLocation: 'Barangay Santo Tomas, Mabalacat, Pampanga',
    rsbsaNumber: 'RSBSA-01-029-2024-00029',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 3.3,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[0]?.id,
    dateOfPlanting: new Date('2024-06-12'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-07'),
    harvestArea: 3.3,
    numberOfBags: 132,
    weightPerBag: 50,
    yieldMtPerHa: 2.0,
    isArchived: false,
    isDeleted: false
  });

  reports.push({
    farmerName: 'Olivia Ferrer',
    farmLocation: 'Barangay Marisol, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-030-2024-00030',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 2.6,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[0]?.id,
    dateOfPlanting: new Date('2024-07-08'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-21'),
    harvestArea: 2.6,
    numberOfBags: 130,
    weightPerBag: 25,
    yieldMtPerHa: 1.25,
    isArchived: false,
    isDeleted: false
  });

  // ============ ARCHIVED REPORTS - 5 reports ============
  // Completed reports that have been archived
  
  reports.push({
    farmerName: 'Patricia Solis',
    farmLocation: 'Barangay Dela Paz Norte, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-031-2023-00031',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 2.0,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[1]?.id,
    dateOfPlanting: new Date('2024-05-10'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-09-05'),
    harvestArea: 2.0,
    numberOfBags: 78,
    weightPerBag: 50,
    yieldMtPerHa: 1.95,
    isArchived: true,
    archivedAt: new Date('2024-11-15'),
    archivedBy: 'admin',
    isDeleted: false
  });

  reports.push({
    farmerName: 'Quirino Ventura',
    farmLocation: 'Barangay San Vicente, Magalang, Pampanga',
    rsbsaNumber: 'RSBSA-01-032-2023-00032',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 1.5,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[1]?.id,
    dateOfPlanting: new Date('2024-05-20'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-09-07'),
    harvestArea: 1.5,
    numberOfBags: 72,
    weightPerBag: 25,
    yieldMtPerHa: 1.2,
    isArchived: true,
    archivedAt: new Date('2024-11-20'),
    archivedBy: 'admin',
    isDeleted: false
  });

  reports.push({
    farmerName: 'Remedios Tan',
    farmLocation: 'Barangay Salapungan, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-033-2023-00033',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 0.8,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[0]?.id,
    dateOfPlanting: new Date('2024-06-05'),
    plantingMethod: 'Transplanting',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-03'),
    harvestArea: 0.8,
    numberOfBags: 80,
    weightPerBag: 10,
    yieldMtPerHa: 1.0,
    isArchived: true,
    archivedAt: new Date('2024-12-01'),
    archivedBy: 'admin',
    isDeleted: false
  });

  reports.push({
    farmerName: 'Salvador Mejia',
    farmLocation: 'Barangay Maimpis, San Fernando, Pampanga',
    rsbsaNumber: 'RSBSA-01-034-2023-00034',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 2.7,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Rice',
    riceIrrigation: 'RainfedLowland',
    varietyId: riceVarieties[2]?.id,
    dateOfPlanting: new Date('2024-05-15'),
    plantingMethod: 'Transplanting',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-09-10'),
    harvestArea: 2.7,
    numberOfBags: 100,
    weightPerBag: 50,
    yieldMtPerHa: 1.85,
    isArchived: true,
    archivedAt: new Date('2024-11-25'),
    archivedBy: 'admin',
    isDeleted: false
  });

  reports.push({
    farmerName: 'Trinidad Robles',
    farmLocation: 'Barangay Anunas, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-035-2023-00035',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 1.2,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[2]?.id,
    dateOfPlanting: new Date('2024-06-01'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-09-15'),
    harvestArea: 1.2,
    numberOfBags: 58,
    weightPerBag: 25,
    yieldMtPerHa: 1.21,
    isArchived: true,
    archivedAt: new Date('2024-12-05'),
    archivedBy: 'admin',
    isDeleted: false
  });

  // ============ DELETED REPORTS - 5 reports ============
  // Soft-deleted reports (30-day recovery period)
  
  reports.push({
    farmerName: 'Vicente Morales',
    farmLocation: 'Barangay Sapang Bato, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-036-2024-00036',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 1.3,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[3]?.id,
    dateOfPlanting: new Date('2025-01-07'),  // REQUIRED in Planting state
    plantingMethod: 'Direct_Seeded',  // REQUIRED in Planting state
    cropInsurance: false,
    state: 'Planting',
    lastUpdatedBy: 'admin',
    isArchived: false,
    isDeleted: true,
    deletedAt: new Date('2024-12-20'),
    deletedBy: 'admin'
  });

  reports.push({
    farmerName: 'Wilma Padilla',
    farmLocation: 'Barangay Sta. Monica, Magalang, Pampanga',
    rsbsaNumber: 'RSBSA-01-037-2024-00037',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 2.4,
    seedClassification: 'Inbred_Good',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[0]?.id,
    dateOfPlanting: new Date('2024-12-01'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: true,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-16'),
    isArchived: false,
    isDeleted: true,
    deletedAt: new Date('2024-12-22'),
    deletedBy: 'admin'
  });

  reports.push({
    farmerName: 'Xavier Zamora',
    farmLocation: 'Barangay Dalayap, Porac, Pampanga',
    rsbsaNumber: 'RSBSA-01-038-2024-00038',
    croppingSeasonId: seasons.find(s => s.name === 'Wet Season 2024')?.id || activeSeason.id,
    areaPlanted: 3.1,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Rice',
    riceIrrigation: 'Irrigated',
    varietyId: riceVarieties[0]?.id,
    dateOfPlanting: new Date('2024-06-08'),
    plantingMethod: 'Transplanting',
    cropInsurance: false,
    state: 'Harvested',
    dateOfExpectedHarvest: new Date('2024-10-03'),
    harvestArea: 3.1,
    numberOfBags: 118,
    weightPerBag: 50,
    yieldMtPerHa: 1.9,
    isArchived: false,
    isDeleted: true,
    deletedAt: new Date('2024-12-18'),
    deletedBy: 'user'
  });

  reports.push({
    farmerName: 'Yolanda Rivera',
    farmLocation: 'Barangay Dolores, Angeles City, Pampanga',
    rsbsaNumber: 'RSBSA-01-039-2024-00039',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 0.6,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'High_Value_Crops',
    varietyId: hvcVarieties[1]?.id,
    dateOfPlanting: new Date('2025-01-13'),  // REQUIRED in Planting state
    plantingMethod: 'Transplanting',  // REQUIRED in Planting state
    cropInsurance: true,
    state: 'Planting',
    lastUpdatedBy: 'admin',
    isArchived: false,
    isDeleted: true,
    deletedAt: new Date('2024-12-23'),
    deletedBy: 'admin'
  });

  reports.push({
    farmerName: 'Zachary Bautista',
    farmLocation: 'Barangay Margot, Mabalacat, Pampanga',
    rsbsaNumber: 'RSBSA-01-040-2024-00040',
    croppingSeasonId: activeSeason.id,
    areaPlanted: 1.7,
    seedClassification: 'Inbred_Certified',
    typeOfCrop: 'Corn',
    varietyId: cornVarieties[1]?.id,
    dateOfPlanting: new Date('2024-11-28'),
    plantingMethod: 'Direct_Seeded',
    cropInsurance: false,
    state: 'Planted',
    dateOfExpectedHarvest: new Date('2025-03-12'),
    isArchived: false,
    isDeleted: true,
    deletedAt: new Date('2024-12-24'),
    deletedBy: 'user'
  });

  // Create all reports
  let createdCount = 0;
  for (const report of reports) {
    try {
      await prisma.plantingReport.create({ data: report });
      createdCount++;
    } catch (error) {
      console.error(`Error creating report for ${report.farmerName}:`, error.message);
    }
  }

  console.log(`✓ Created ${createdCount} planting reports`);
  console.log(`  - Planting Reports: ${reports.filter(r => r.state === 'Planting' && !r.isDeleted && !r.isArchived).length}`);
  console.log(`  - Planted Reports: ${reports.filter(r => r.state === 'Planted' && !r.isDeleted && !r.isArchived).length}`);
  console.log(`  - Harvested Reports: ${reports.filter(r => r.state === 'Harvested' && !r.isDeleted && !r.isArchived).length}`);
  console.log(`  - Archived Reports: ${reports.filter(r => r.isArchived).length}`);
  console.log(`  - Deleted Reports: ${reports.filter(r => r.isDeleted).length}`);
}

async function main() {
  try {
    console.log('🌱 Starting planting reports seed...\n');

    await cleanupExistingReports();
    await createPlantingSeasons();
    await createSeedVarieties();
    await createPlantingReports();

    console.log('\n✅ Planting reports seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding planting reports:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
