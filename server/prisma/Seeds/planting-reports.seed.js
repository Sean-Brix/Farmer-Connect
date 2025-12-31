export async function seedPlantingSeasons(prisma) {
  const seasons = [
    {
      name: 'Wet Season 2024',
      description: 'Main cropping season with natural rainfall',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-11-30'),
      isActive: false
    },
    {
      name: 'Dry Season 2025',
      description: 'Irrigated cropping season',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-05-31'),
      isActive: false
    },
    {
      name: 'Wet Season 2025',
      description: 'Current main cropping season',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-11-30'),
      isActive: true
    },
    {
      name: 'Dry Season 2026',
      description: 'Upcoming dry season',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2026-05-31'),
      isActive: true
    }
  ];

  const createdSeasons = [];
  for (const season of seasons) {
    const created = await prisma.plantingSeason.create({ data: season });
    createdSeasons.push(created);
  }

  console.log(`✅ Created ${createdSeasons.length} planting seasons`);
  return createdSeasons;
}

export async function seedSeedVarieties(prisma) {
  const varieties = [
    // Rice varieties
    { name: 'NSIC Rc222', cropType: 'Rice', directSeededDAS: 105, transplantedDAS: 115, description: 'High-yielding aromatic rice variety' },
    { name: 'PSB Rc18', cropType: 'Rice', directSeededDAS: 110, transplantedDAS: 120, description: 'Premium quality rice with good resistance' },
    { name: 'NSIC Rc160', cropType: 'Rice', directSeededDAS: 100, transplantedDAS: 110, description: 'Early maturing variety suitable for rainfed areas' },
    
    // Corn varieties
    { name: 'Pioneer 30G87', cropType: 'Corn', directSeededDAS: 95, transplantedDAS: 105, description: 'Yellow corn hybrid with excellent yield potential' },
    { name: 'Dekalb 9144', cropType: 'Corn', directSeededDAS: 100, transplantedDAS: 110, description: 'White corn variety with drought tolerance' },
    { name: 'NK6410', cropType: 'Corn', directSeededDAS: 90, transplantedDAS: 100, description: 'High-yielding corn with strong stalks' },
    
    // High Value Crops
    { name: 'Determinate Tomato', cropType: 'High_Value_Crops', directSeededDAS: 75, transplantedDAS: 85, description: 'Compact bushy tomato variety' },
    { name: 'Long Green Eggplant', cropType: 'High_Value_Crops', directSeededDAS: 80, transplantedDAS: 90, description: 'Popular Philippine eggplant variety' },
    { name: 'Sweet Bell Pepper', cropType: 'High_Value_Crops', directSeededDAS: 85, transplantedDAS: 95, description: 'Colorful sweet pepper for fresh market' },
    { name: 'Chinese Cabbage', cropType: 'High_Value_Crops', directSeededDAS: 60, transplantedDAS: 70, description: 'Fast-growing leafy vegetable' }
  ];

  const createdVarieties = [];
  for (const variety of varieties) {
    const created = await prisma.seedVariety.create({ data: variety });
    createdVarieties.push(created);
  }

  console.log(`✅ Created ${createdVarieties.length} seed varieties (${varieties.filter(v => v.cropType === 'Rice').length} Rice, ${varieties.filter(v => v.cropType === 'Corn').length} Corn, ${varieties.filter(v => v.cropType === 'High_Value_Crops').length} HVC)`);
  return createdVarieties;
}

export async function seedPlantingReports(prisma, seasons, varieties) {
  // ============================================================================
  // THREE-STATE SYSTEM FOR PLANTING REPORTS
  // ============================================================================
  // State 1: Request_Report - Seeds distributed, NOT planted yet
  // State 2: Planted - Crop planted, NOT harvested yet
  // State 3: Completed - Crop harvested, all data complete
  // Additional: isArchived (separate from state), isDeleted (soft delete)
  // ============================================================================

  // Fetch existing distribution requests to link planting reports
  const distributionRequests = await prisma.itemTransaction.findMany({
    where: {
      itemStack: {
        status: 'Distributed'
      },
      status: {
        in: ['Picked_Up', 'Planted', 'late_pickup']
      },
      plantingReportId: null
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
      },
      account: {
        select: {
          firstName: true,
          surname: true,
          client_profile: {
            select: {
              rsbsaNumber: true
            }
          }
        }
      }
    },
    take: 8
  });

  console.log(`📦 Found ${distributionRequests.length} distribution requests to link`);

  // Sample farmer data for non-distribution reports
  const farmers = [
    { name: 'Juan Dela Cruz', location: 'Barangay San Jose, Nueva Ecija', rsbsa: 'NE-01-001-000123' },
    { name: 'Maria Santos', location: 'Barangay Poblacion, Bulacan', rsbsa: 'BU-02-003-000456' },
    { name: 'Pedro Reyes', location: 'Barangay Malaya, Pampanga', rsbsa: 'PA-03-002-000789' },
    { name: 'Ana Garcia', location: 'Barangay Rizal, Tarlac', rsbsa: null },
    { name: 'Jose Mendoza', location: 'Barangay Luna, Nueva Ecija', rsbsa: 'NE-01-004-000234' },
    { name: 'Rosa Fernandez', location: 'Barangay Burgos, Bulacan', rsbsa: 'BU-02-001-000567' },
    { name: 'Carlos Ramos', location: 'Barangay Mabini, Pampanga', rsbsa: 'PA-03-005-000890' },
    { name: 'Elena Torres', location: 'Barangay Del Pilar, Tarlac', rsbsa: null },
    { name: 'Miguel Cruz', location: 'Barangay Bonifacio, Nueva Ecija', rsbsa: 'NE-01-002-000345' },
    { name: 'Sofia Castillo', location: 'Barangay Aguinaldo, Bulacan', rsbsa: 'BU-02-004-000678' }
  ];

  const seedClassifications = ['Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers'];
  const riceIrrigations = ['Irrigated', 'RainfedLowland'];
  const plantingMethods = ['Direct_Seeded', 'Transplanting'];
  const activeSeason = seasons.find((s) => s.isActive) || seasons[0];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const reports = [];
  let distributionIndex = 0;

  // Helper to get distribution link data
  const getDistributionLink = () => {
    if (distributionIndex < distributionRequests.length) {
      const req = distributionRequests[distributionIndex++];
      return {
        distributionRequestId: req.id,
        distributionItemId: req.itemStack.item.id,
        distributionQuantity: req.quantity,
        distributionUnit: req.itemStack.item.unit,
        distributionPickupDate: req.actual_pickup || req.pickupDate,
        distributedQuantity: req.quantity,
        farmerName: `${req.account.firstName} ${req.account.surname}`.trim(),
        rsbsaNumber: req.account.client_profile?.rsbsaNumber || null,
        farmLocation: req.farmLocation,
        areaPlanted: req.areaPlanted,
        plantingMethod: req.plantingMethod,
        varietyId: req.itemStack.item.seedVarietyId
      };
    }
    return null;
  };

  // Create distribution-linked Request_Report entries (State 1)
  for (let i = 0; i < Math.min(3, distributionRequests.length); i++) {
    const dist = getDistributionLink();
    if (!dist) break;

    const variety = varieties.find(v => v.id === dist.varietyId) || pick(varieties);
    
    reports.push({
      farmerName: dist.farmerName,
      farmLocation: dist.farmLocation,
      rsbsaNumber: dist.rsbsaNumber,
      croppingSeasonId: activeSeason?.id || null,
      areaPlanted: dist.areaPlanted,
      seedClassification: pick(seedClassifications),
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? pick(riceIrrigations) : null,
      varietyId: variety.id,
      dateOfPlanting: null,  // Not planted yet
      plantingMethod: dist.plantingMethod || null,  // From distribution request
      cropInsurance: Math.random() > 0.6,
      state: 'Distributed',
      distributionRequestId: dist.distributionRequestId,
      distributionItemId: dist.distributionItemId,
      distributionQuantity: dist.distributionQuantity,
      distributionUnit: dist.distributionUnit,
      distributionPickupDate: dist.distributionPickupDate,
      distributedQuantity: dist.distributedQuantity,
      lastUpdatedBy: 'admin',
      isArchived: false,
      isDeleted: false
    });
  }

  // Create regular Request_Report entries (no distribution link)
  for (let i = 0; i < 2; i++) {
    const farmer = farmers[i % farmers.length];
    const variety = pick(varieties);
    const areaPlanted = 0.5 + Math.random() * 2;

    reports.push({
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason?.id || null,
      areaPlanted: parseFloat(areaPlanted.toFixed(2)),
      seedClassification: pick(seedClassifications),
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? pick(riceIrrigations) : null,
      varietyId: variety.id,
      dateOfPlanting: null,
      plantingMethod: null,  // Optional in State 1
      cropInsurance: Math.random() > 0.6,
      state: 'Planting',
      lastUpdatedBy: 'admin',
      isArchived: false,
      isDeleted: false
    });
  }

  // Create Planted reports (State 2)
  for (let i = 0; i < 5; i++) {
    const farmer = farmers[(i + 2) % farmers.length];
    const variety = pick(varieties);
    const areaPlanted = 0.5 + Math.random() * 2;
    const plantingMethod = pick(plantingMethods);
    
    const dateOfPlanting = new Date();
    dateOfPlanting.setDate(dateOfPlanting.getDate() - (30 + Math.floor(Math.random() * 60)));
    
    const expectedHarvestDate = new Date(dateOfPlanting);
    const daysToHarvest = plantingMethod === 'Direct_Seeded' ? variety.directSeededDAS : variety.transplantedDAS;
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + daysToHarvest);

    reports.push({
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason?.id || null,
      areaPlanted: parseFloat(areaPlanted.toFixed(2)),
      seedClassification: pick(seedClassifications),
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? pick(riceIrrigations) : null,
      varietyId: variety.id,
      dateOfPlanting,
      plantingMethod,
      cropInsurance: Math.random() > 0.6,
      dateOfExpectedHarvest: expectedHarvestDate,
      state: 'Planted',
      lastUpdatedBy: 'admin',
      isArchived: false,
      isDeleted: false
    });
  }

  // Create Completed reports (State 3)
  for (let i = 0; i < 5; i++) {
    const farmer = farmers[(i + 7) % farmers.length];
    const variety = pick(varieties);
    const areaPlanted = 0.5 + Math.random() * 2;
    const plantingMethod = pick(plantingMethods);
    
    const dateOfPlanting = new Date();
    dateOfPlanting.setDate(dateOfPlanting.getDate() - (90 + Math.floor(Math.random() * 60)));
    
    const expectedHarvestDate = new Date(dateOfPlanting);
    const daysToHarvest = plantingMethod === 'Direct_Seeded' ? variety.directSeededDAS : variety.transplantedDAS;
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + daysToHarvest);

    const harvestArea = areaPlanted * (0.9 + Math.random() * 0.1);
    const numberOfBags = Math.floor(harvestArea * (30 + Math.random() * 40));
    const weightPerBag = 45 + Math.random() * 10;
    const totalWeightMT = (numberOfBags * weightPerBag) / 1000;
    const yieldMtPerHa = totalWeightMT / harvestArea;

    reports.push({
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason?.id || null,
      areaPlanted: parseFloat(areaPlanted.toFixed(2)),
      seedClassification: pick(seedClassifications),
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? pick(riceIrrigations) : null,
      varietyId: variety.id,
      dateOfPlanting,
      plantingMethod,
      cropInsurance: Math.random() > 0.6,
      dateOfExpectedHarvest: expectedHarvestDate,
      harvestArea: parseFloat(harvestArea.toFixed(2)),
      numberOfBags,
      weightPerBag: parseFloat(weightPerBag.toFixed(2)),
      yieldMtPerHa: parseFloat(yieldMtPerHa.toFixed(2)),
      state: 'Harvested',
      lastUpdatedBy: 'admin',
      isArchived: false,
      isDeleted: false
    });
  }

  // Create Archived reports
  for (let i = 0; i < 3; i++) {
    const farmer = farmers[(i + 5) % farmers.length];
    const variety = pick(varieties);
    const areaPlanted = 0.5 + Math.random() * 2;
    const plantingMethod = pick(plantingMethods);
    
    const dateOfPlanting = new Date();
    dateOfPlanting.setDate(dateOfPlanting.getDate() - (120 + Math.floor(Math.random() * 60)));
    
    const expectedHarvestDate = new Date(dateOfPlanting);
    const daysToHarvest = plantingMethod === 'Direct_Seeded' ? variety.directSeededDAS : variety.transplantedDAS;
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + daysToHarvest);

    const harvestArea = areaPlanted * (0.9 + Math.random() * 0.1);
    const numberOfBags = Math.floor(harvestArea * (30 + Math.random() * 40));
    const weightPerBag = 45 + Math.random() * 10;
    const totalWeightMT = (numberOfBags * weightPerBag) / 1000;
    const yieldMtPerHa = totalWeightMT / harvestArea;

    reports.push({
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason?.id || null,
      areaPlanted: parseFloat(areaPlanted.toFixed(2)),
      seedClassification: pick(seedClassifications),
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? pick(riceIrrigations) : null,
      varietyId: variety.id,
      dateOfPlanting,
      plantingMethod,
      cropInsurance: Math.random() > 0.6,
      dateOfExpectedHarvest: expectedHarvestDate,
      harvestArea: parseFloat(harvestArea.toFixed(2)),
      numberOfBags,
      weightPerBag: parseFloat(weightPerBag.toFixed(2)),
      yieldMtPerHa: parseFloat(yieldMtPerHa.toFixed(2)),
      state: 'Harvested',
      lastUpdatedBy: 'admin',
      isArchived: true,
      archivedAt: new Date(),
      archivedBy: 'admin',
      isDeleted: false
    });
  }

  // Create Deleted reports (soft delete)
  for (let i = 0; i < 2; i++) {
    const farmer = farmers[i % farmers.length];
    const variety = pick(varieties);
    const areaPlanted = 0.5 + Math.random() * 2;

    reports.push({
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason?.id || null,
      areaPlanted: parseFloat(areaPlanted.toFixed(2)),
      seedClassification: pick(seedClassifications),
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? pick(riceIrrigations) : null,
      varietyId: variety.id,
      dateOfPlanting: null,
      plantingMethod: null,
      cropInsurance: Math.random() > 0.6,
      state: 'Planting',
      lastUpdatedBy: 'admin',
      isArchived: false,
      isDeleted: true,
      deletedAt: new Date(Date.now() - (7 + i * 3) * 24 * 60 * 60 * 1000),
      deletedBy: 'admin'
    });
  }

  // Create all reports
  const createdReports = [];
  for (const report of reports) {
    try {
      const created = await prisma.plantingReport.create({ data: report });
      createdReports.push(created);
      
      // Link distribution request if applicable
      if (report.distributionRequestId) {
        await prisma.itemTransaction.update({
          where: { id: report.distributionRequestId },
          data: { plantingReportId: created.id }
        });
      }
    } catch (error) {
      console.error(`Error creating report for ${report.farmerName}:`, error.message);
    }
  }

  const requestReports = createdReports.filter((r) => (r.state === 'Distributed' || r.state === 'Planting') && !r.isDeleted && !r.isArchived).length;
  const plantedReports = createdReports.filter((r) => r.state === 'Planted' && !r.isDeleted && !r.isArchived).length;
  const completedReports = createdReports.filter((r) => r.state === 'Harvested' && !r.isDeleted && !r.isArchived).length;
  const archivedReports = createdReports.filter((r) => r.isArchived).length;
  const deletedReports = createdReports.filter((r) => r.isDeleted).length;
  const distributionLinked = createdReports.filter((r) => r.distributionRequestId).length;

  console.log(`✅ Created ${createdReports.length} planting reports:`);
  console.log(`   - Request Reports: ${requestReports}`);
  console.log(`   - Planted Reports: ${plantedReports}`);
  console.log(`   - Completed Reports: ${completedReports}`);
  console.log(`   - Archived: ${archivedReports}`);
  console.log(`   - Deleted: ${deletedReports}`);
  console.log(`   - Distribution Linked: ${distributionLinked}`);

  return createdReports;
}
