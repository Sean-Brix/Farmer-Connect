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
  // Sample farmer data
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

  const reports = [];
  
  // Get active season (Wet Season 2025)
  const activeSeason = seasons.find(s => s.name === 'Wet Season 2025');
  
  for (let i = 0; i < 10; i++) {
    const farmer = farmers[i];
    const variety = varieties[Math.floor(Math.random() * varieties.length)];
    const plantingMethod = plantingMethods[Math.floor(Math.random() * plantingMethods.length)];
    
    // Random planting date in last 90 days
    const plantingDate = new Date();
    plantingDate.setDate(plantingDate.getDate() - Math.floor(Math.random() * 90));
    
    // Calculate expected harvest based on variety and planting method
    const expectedHarvestDate = new Date(plantingDate);
    const daysToHarvest = plantingMethod === 'Direct_Seeded' ? variety.directSeededDAS : variety.transplantedDAS;
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + daysToHarvest);
    
    const areaPlanted = 0.5 + Math.random() * 2; // 0.5 to 2.5 hectares
    
    // Some reports have harvest data (if planting was >100 days ago)
    const daysAgo = Math.floor((new Date() - plantingDate) / (1000 * 60 * 60 * 24));
    const hasHarvestData = daysAgo > 100;
    
    const reportData = {
      farmerName: farmer.name,
      farmLocation: farmer.location,
      rsbsaNumber: farmer.rsbsa,
      croppingSeasonId: activeSeason.id,
      areaPlanted: parseFloat(areaPlanted.toFixed(2)),
      seedClassification: seedClassifications[Math.floor(Math.random() * seedClassifications.length)],
      typeOfCrop: variety.cropType,
      riceIrrigation: variety.cropType === 'Rice' ? riceIrrigations[Math.floor(Math.random() * riceIrrigations.length)] : null,
      varietyId: variety.id,
      dateOfPlanting: plantingDate,
      plantingMethod: plantingMethod,
      cropInsurance: Math.random() > 0.6,
      dateOfExpectedHarvest: expectedHarvestDate,
      isArchived: Math.random() > 0.8 // 20% archived
    };

    // Add harvest data if applicable
    if (hasHarvestData) {
      const harvestArea = areaPlanted * (0.9 + Math.random() * 0.1); // 90-100% of planted area
      const numberOfBags = Math.floor(harvestArea * (30 + Math.random() * 40)); // 30-70 bags per hectare
      const weightPerBag = 45 + Math.random() * 10; // 45-55 kg per bag
      
      // Calculate yield in mt/ha
      const totalWeight = numberOfBags * weightPerBag; // in kg
      const totalWeightMT = totalWeight / 1000; // convert to metric tons
      const yieldMtPerHa = totalWeightMT / harvestArea;
      
      reportData.harvestArea = parseFloat(harvestArea.toFixed(2));
      reportData.numberOfBags = numberOfBags;
      reportData.weightPerBag = parseFloat(weightPerBag.toFixed(2));
      reportData.yieldMtPerHa = parseFloat(yieldMtPerHa.toFixed(2));
    }

    const report = await prisma.plantingReport.create({ data: reportData });
    reports.push(report);
  }

  const withHarvest = reports.filter(r => r.harvestArea).length;
  const archived = reports.filter(r => r.isArchived).length;
  console.log(`✅ Created ${reports.length} planting reports (${withHarvest} with harvest data, ${archived} archived)`);
  
  return reports;
}
