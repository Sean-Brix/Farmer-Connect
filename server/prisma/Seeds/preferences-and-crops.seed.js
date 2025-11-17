export async function seedUserPreferences(prisma) {
  // Simplified - just set basic preferences for all users
  const users = await prisma.account.findMany({ 
    where: { access: 'User' }, 
    select: { id: true } 
  });
  
  for (const user of users) {
    await prisma.userPreference.createMany({
      data: [
        { userId: user.id, key: 'language', value: 'en' },
        { userId: user.id, key: 'notifications_email', value: 'true' },
      ],
      skipDuplicates: true,
    });
  }
  
  console.log(`✅ Created preferences for ${users.length} users`);
}

export async function seedRegisteredCrops(prisma) {
  // Get all users (excluding admin)
  const users = await prisma.account.findMany({ 
    where: { access: 'User' }, 
    select: { id: true, username: true },
    orderBy: { createdAt: 'asc' }
  });

  // Get all guidelines
  const guidelines = await prisma.cropGuideline.findMany({
    select: { id: true, name: true }
  });

  // Define which users get how many crops
  // Users 1-6: 1-2 crops each (will have reports)
  // Users 7-9: 1-2 crops each (no reports)
  
  const cropAssignments = [
    // User 1: Juan - 2 crops
    { 
      userIndex: 0, 
      crops: [
        { guidelineName: 'Rice (Inbred)', variety: 'NSIC Rc222', area: 1.5, daysAgo: 90 },
        { guidelineName: 'Corn (Sweet Corn)', variety: 'Sweet Grande', area: 0.8, daysAgo: 60 }
      ]
    },
    // User 2: Maria - 2 crops
    { 
      userIndex: 1, 
      crops: [
        { guidelineName: 'Tomato', variety: 'Diamante Max', area: 0.5, daysAgo: 75 },
        { guidelineName: 'Eggplant', variety: 'Mara', area: 0.6, daysAgo: 80 }
      ]
    },
    // User 3: Pedro - 1 crop
    { 
      userIndex: 2, 
      crops: [
        { guidelineName: 'Rice (Inbred)', variety: 'PSB Rc18', area: 2.0, daysAgo: 100 }
      ]
    },
    // User 4: Ana - 2 crops
    { 
      userIndex: 3, 
      crops: [
        { guidelineName: 'Mongo (Mung Bean)', variety: 'Pagasa 3', area: 1.0, daysAgo: 50 },
        { guidelineName: 'Peanut (Groundnut)', variety: 'PN 19', area: 0.7, daysAgo: 85 }
      ]
    },
    // User 5: Jose - 1 crop
    { 
      userIndex: 4, 
      crops: [
        { guidelineName: 'Sweet Potato (Kamote)', variety: 'VSP', area: 1.2, daysAgo: 70 }
      ]
    },
    // User 6: Rosa - 2 crops
    { 
      userIndex: 5, 
      crops: [
        { guidelineName: 'Cassava (Kamoteng Kahoy)', variety: 'Lakan 1', area: 1.5, daysAgo: 200 },
        { guidelineName: 'Corn (Sweet Corn)', variety: 'Honey Bantam', area: 0.9, daysAgo: 55 }
      ]
    },
    // User 7: Carlos - 1 crop (NO REPORTS)
    { 
      userIndex: 6, 
      crops: [
        { guidelineName: 'Banana (Lakatan)', variety: 'Lakatan', area: 0.8, daysAgo: 180 }
      ]
    },
    // User 8: Elena - 2 crops (NO REPORTS)
    { 
      userIndex: 7, 
      crops: [
        { guidelineName: 'Tomato', variety: 'Apollo', area: 0.4, daysAgo: 65 },
        { guidelineName: 'Eggplant', variety: 'Morena', area: 0.5, daysAgo: 70 }
      ]
    },
    // User 9: Roberto - 1 crop (NO REPORTS)
    { 
      userIndex: 8, 
      crops: [
        { guidelineName: 'Mango', variety: 'Carabao', area: 1.0, daysAgo: 730 }
      ]
    },
  ];

  let totalCrops = 0;

  for (const assignment of cropAssignments) {
    const user = users[assignment.userIndex];
    if (!user) continue;

    for (const cropData of assignment.crops) {
      const guideline = guidelines.find(g => g.name === cropData.guidelineName);
      if (!guideline) continue;

      const plantingDate = new Date();
      plantingDate.setDate(plantingDate.getDate() - cropData.daysAgo);

      const expectedHarvest = new Date(plantingDate);
      expectedHarvest.setDate(expectedHarvest.getDate() + 120); // Default 120 days

      await prisma.registeredCrop.create({
        data: {
          userId: user.id,
          guidelineId: guideline.id,
          cropType: cropData.guidelineName,
          variety: cropData.variety,
          plantingDate,
          expectedHarvest,
          area: cropData.area,
          status: 'Active',
          currentStageIndex: 2,
          currentStageName: 'Vegetative',
          completedStages: 2,
          totalStages: guideline.stages?.length || 0,
          notes: `Following ${cropData.guidelineName} guideline`,
        },
      });
      
      totalCrops++;
    }
  }

  console.log(`✅ Created ${totalCrops} registered crops for ${users.length} farmers`);
}
