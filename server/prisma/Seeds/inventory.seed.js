/**
 * Inventory Items Seed Script
 * Creates EIC items (farming equipment) and Distribution items (seeds only)
 * IMPORTANT: EIC and Distribution are separate systems!
 * - EIC: Equipment rental/borrowing (hand tractors, sprayers, etc.)
 * - Distribution: Seed distribution connected to planting reports
 */

export async function seedInventoryItems(prisma) {
  // ==================== EIC ITEMS (Farming Equipment) ====================
  const eicItems = [
    {
      name: 'Hand Tractor - Kubota KJ15',
      description: '15HP diesel-powered hand tractor ideal for rice field preparation, plowing, and harrowing. Includes rotavator attachment.',
      category: 'Farming_Equipment',
    },
    {
      name: 'Knapsack Sprayer - 16L Capacity',
      description: 'Manual backpack sprayer for pesticide and fertilizer application. Adjustable nozzle for different spray patterns.',
      category: 'Pest_Control',
    },
    {
      name: 'Rice Thresher - Portable Model',
      description: 'Gasoline-powered portable rice thresher with 500kg/hour capacity. Lightweight and easy to transport.',
      category: 'Harvesting_Tools',
    },
    {
      name: 'Water Pump - 2-inch Centrifugal',
      description: 'Gasoline-powered water pump for irrigation. 2-inch inlet/outlet, 30m maximum head, 400L/min flow rate.',
      category: 'Irrigation_Systems',
    },
    {
      name: 'Mechanical Rice Dryer - Batch Type',
      description: 'Batch-type mechanical dryer with 2-ton capacity per batch. Reduces moisture content from 24% to 14% in 6-8 hours.',
      category: 'Processing_Equipment',
    },
    {
      name: 'Corn Sheller - Hand Operated',
      description: 'Manual corn sheller with dual rollers. Can process 50-80kg of dried corn per hour. Durable cast iron construction.',
      category: 'Harvesting_Tools',
    },
  ];

  // Create EIC items
  await prisma.inventoryItem.createMany({
    data: eicItems,
    skipDuplicates: true,
  });

  const createdEicItems = await prisma.inventoryItem.findMany({
    where: {
      name: { in: eicItems.map(i => i.name) }
    }
  });

  console.log(`✅ Created ${createdEicItems.length} EIC items (farming equipment)`);
  
  // ==================== DISTRIBUTION ITEMS (Seeds Only) ====================
  // Note: Distribution items require seedVarietyId
  const seedVarieties = await prisma.seedVariety.findMany();
  
  if (seedVarieties.length > 0) {
    const distributionItems = seedVarieties.map(variety => ({
      name: `${variety.name} Seeds`,
      description: `${variety.description}`,
      category: 'Seeds',
      unit: 'kg',
      seedVarietyId: variety.id
    }));

    await prisma.inventoryItem.createMany({
      data: distributionItems,
      skipDuplicates: true,
    });

    const createdDistItems = await prisma.inventoryItem.findMany({
      where: {
        seedVarietyId: { not: null }
      }
    });

    console.log(`✅ Created ${createdDistItems.length} Distribution items (seeds only)`);
  } else {
    console.log('⚠️  No seed varieties found. Skipping distribution items. Run seed varieties first.');
  }

  // Return all created items
  return await prisma.inventoryItem.findMany();
}

export async function seedItemStacks(prisma) {
  const items = await prisma.inventoryItem.findMany({ 
    select: { id: true, name: true, category: true, seedVarietyId: true } 
  });
  
  // Separate EIC and Distribution items
  const eicItems = items.filter(item => item.seedVarietyId === null);
  const distributionItems = items.filter(item => item.seedVarietyId !== null);
  
  const allStacks = [];

  // ==================== EIC STACKS (Equipment) ====================
  // EIC items have: Available, Unavailable, Damaged, EIC statuses
  const eicStatuses = ['Available', 'Unavailable', 'Damaged', 'EIC'];
  
  for (const item of eicItems) {
    // Create 3-5 stacks per EIC item with different statuses
    const numStacks = Math.floor(Math.random() * 3) + 3; // 3-5 stacks
    
    for (let i = 0; i < numStacks; i++) {
      const status = eicStatuses[i % eicStatuses.length];
      const quantity = status === 'Available' ? Math.floor(Math.random() * 10) + 5 :
                      status === 'Damaged' ? Math.floor(Math.random() * 3) + 1 :
                      Math.floor(Math.random() * 8) + 2;

      allStacks.push({
        itemId: item.id,
        quantity,
        status,
        date_limit: status === 'EIC' ? 30 : null, // 30-day borrowing limit for EIC
        max_quantity_per_request: status === 'EIC' ? 1 : null, // Usually 1 equipment per request
      });
    }
  }

  // ==================== DISTRIBUTION STACKS (Seeds Only) ====================
  // Distribution items have: Available, Distributed statuses only
  for (const item of distributionItems) {
    // Each seed variety gets 2 stacks: Available and Distributed
    allStacks.push({
      itemId: item.id,
      quantity: Math.floor(Math.random() * 500) + 200, // 200-700 kg available
      status: 'Available',
      max_quantity_per_request: 50, // Max 50kg per farmer request
    });

    allStacks.push({
      itemId: item.id,
      quantity: Math.floor(Math.random() * 1000) + 500, // 500-1500 kg distributed
      status: 'Distributed',
      max_quantity_per_request: 50,
    });
  }

  // Create all stacks
  await prisma.itemStack.createMany({
    data: allStacks,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${allStacks.length} item stacks:`);
  console.log(`   - ${eicItems.length * 4} EIC stacks (Available, Unavailable, Damaged, EIC)`);
  console.log(`   - ${distributionItems.length * 2} Distribution stacks (Available, Distributed)`);
}

export async function seedItemTransactions(prisma) {
  // Get accounts for transactions
  const users = await prisma.account.findMany({
    where: { access: 'User' },
    take: 10
  });

  const admin = await prisma.account.findFirst({
    where: { access: { in: ['Admin', 'Super_Admin'] } }
  });

  if (users.length === 0 || !admin) {
    console.log('⚠️  No users or admin found. Skipping transactions.');
    return [];
  }

  // ==================== EIC TRANSACTIONS (All possible states) ====================
  const eicStacks = await prisma.itemStack.findMany({
    where: {
      status: 'EIC',
      item: { seedVarietyId: null } // Only equipment, not seeds
    },
    include: { item: true },
    take: 10
  });

  const eicStatuses = [
    'Pending',      // Waiting for approval
    'Approved',     // Approved, not picked up yet (item RESERVED)
    'Borrowed',     // Picked up on time
    'late_pickup',  // Picked up late
    'Returned',     // Returned on time
    'late_return',  // Returned late
    'No_Pickup',    // Approved but never picked up
    'No_Return',    // Borrowed but never returned
    'Rejected',     // Request rejected
    'Cancelled',    // User cancelled
  ];

  const eicTransactions = [];
  const now = new Date();

  for (const status of eicStatuses) {
    for (let i = 0; i < 2 && i < eicStacks.length; i++) {
      const stack = eicStacks[i % eicStacks.length];
      const user = users[i % users.length];
      
      let requestDate, pickupDate, returnDate, actualPickup, actualReturn;
      
      // Calculate dates based on status
      if (status === 'Pending') {
        requestDate = new Date(now.getTime() - (i + 1) * 86400000); // i+1 days ago
        pickupDate = new Date(now.getTime() + (i + 2) * 86400000); // i+2 days from now
        returnDate = new Date(pickupDate.getTime() + 7 * 86400000); // 7 days after pickup
      } else if (status === 'Approved') {
        requestDate = new Date(now.getTime() - (i + 5) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 1) * 86400000); // Future pickup
        returnDate = new Date(pickupDate.getTime() + 7 * 86400000);
      } else if (status === 'Borrowed') {
        requestDate = new Date(now.getTime() - (i + 10) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 3) * 86400000);
        returnDate = new Date(now.getTime() + (i + 4) * 86400000); // Future return
        actualPickup = pickupDate;
      } else if (status === 'late_pickup') {
        requestDate = new Date(now.getTime() - (i + 15) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 8) * 86400000);
        returnDate = new Date(now.getTime() + (i + 2) * 86400000);
        actualPickup = new Date(pickupDate.getTime() + 2 * 86400000); // 2 days late
      } else if (status === 'Returned') {
        requestDate = new Date(now.getTime() - (i + 20) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 15) * 86400000);
        returnDate = new Date(now.getTime() - (i + 5) * 86400000);
        actualPickup = pickupDate;
        actualReturn = returnDate;
      } else if (status === 'late_return') {
        requestDate = new Date(now.getTime() - (i + 25) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 20) * 86400000);
        returnDate = new Date(now.getTime() - (i + 10) * 86400000);
        actualPickup = pickupDate;
        actualReturn = new Date(returnDate.getTime() + 3 * 86400000); // 3 days late
      } else if (status === 'No_Pickup') {
        requestDate = new Date(now.getTime() - (i + 30) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 20) * 86400000); // Pickup was in past
        returnDate = new Date(pickupDate.getTime() + 7 * 86400000);
      } else if (status === 'No_Return') {
        requestDate = new Date(now.getTime() - (i + 40) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 35) * 86400000);
        returnDate = new Date(now.getTime() - (i + 25) * 86400000); // Return was in past
        actualPickup = pickupDate;
      } else if (status === 'Rejected') {
        requestDate = new Date(now.getTime() - (i + 10) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 5) * 86400000);
        returnDate = new Date(pickupDate.getTime() + 7 * 86400000);
      } else { // Cancelled
        requestDate = new Date(now.getTime() - (i + 8) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 3) * 86400000);
        returnDate = new Date(pickupDate.getTime() + 7 * 86400000);
      }

      eicTransactions.push({
        itemStackId: stack.id,
        accountId: user.id,
        adminId: ['Approved', 'Borrowed', 'late_pickup', 'Returned', 'late_return', 'No_Pickup', 'No_Return', 'Rejected'].includes(status) ? admin.id : null,
        quantity: 1, // Usually 1 equipment per request
        status,
        pickupDate,
        returnDate,
        actual_pickup: actualPickup || null,
        actual_return: actualReturn || null,
        requestNote: `${status} - EIC request for ${stack.item.name}`,
        statusChangeReason: ['Rejected', 'Cancelled'].includes(status) ? 'Sample reason for status' : null,
        createdAt: requestDate,
        updatedAt: actualReturn || actualPickup || requestDate,
      });
    }
  }

  await prisma.itemTransaction.createMany({ 
    data: eicTransactions,
    skipDuplicates: true 
  });

  console.log(`✅ Created ${eicTransactions.length} EIC transactions (2 per status)`);

  // ==================== DISTRIBUTION TRANSACTIONS (Connected to Planting Reports) ====================
  const distributionStacks = await prisma.itemStack.findMany({
    where: {
      status: 'Distributed',
      item: { seedVarietyId: { not: null } } // Only seeds
    },
    include: {
      item: {
        include: {
          seedVariety: true
        }
      }
    },
    take: 10
  });

  if (distributionStacks.length === 0) {
    console.log('⚠️  No distributed seed stacks found. Skipping distribution transactions.');
    return eicTransactions;
  }

  const distributionStatuses = [
    'Pending',      // Waiting for approval
    'Approved',     // Approved for pickup
    'Picked_Up',    // Picked up (waiting for planting report)
    'Planted',      // Planting report submitted
    'Rejected',     // Request rejected
    'Cancelled',    // User cancelled
  ];

  const distributionTransactions = [];

  for (const status of distributionStatuses) {
    for (let i = 0; i < 2 && i < distributionStacks.length; i++) {
      const stack = distributionStacks[i % distributionStacks.length];
      const user = users[i % users.length];
      const quantity = Math.floor(Math.random() * 30) + 10; // 10-40 kg
      
      let requestDate, pickupDate, actualPickup, plantingDeadline;
      const plantingMethods = ['Direct_Seeded', 'Transplanting'];
      const farmLocations = [
        'Barangay San Jose, Nueva Ecija',
        'Barangay Poblacion, Bulacan',
        'Barangay Malaya, Pampanga',
        'Barangay Rizal, Tarlac',
      ];
      
      // Calculate dates based on status
      if (status === 'Pending') {
        requestDate = new Date(now.getTime() - (i + 1) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 2) * 86400000);
      } else if (status === 'Approved') {
        requestDate = new Date(now.getTime() - (i + 3) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 1) * 86400000);
      } else if (status === 'Picked_Up' || status === 'Planted') {
        requestDate = new Date(now.getTime() - (i + 30) * 86400000);
        pickupDate = new Date(now.getTime() - (i + 20) * 86400000);
        actualPickup = pickupDate;
        plantingDeadline = new Date(actualPickup.getTime() + (stack.item.seedVariety?.plantingWindow || 30) * 86400000);
      } else if (status === 'Rejected') {
        requestDate = new Date(now.getTime() - (i + 10) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 5) * 86400000);
      } else { // Cancelled
        requestDate = new Date(now.getTime() - (i + 8) * 86400000);
        pickupDate = new Date(now.getTime() + (i + 3) * 86400000);
      }

      distributionTransactions.push({
        itemStackId: stack.id,
        accountId: user.id,
        adminId: ['Approved', 'Picked_Up', 'Planted', 'Rejected'].includes(status) ? admin.id : null,
        quantity,
        status,
        pickupDate,
        actual_pickup: actualPickup || null,
        requestNote: `${status} - Distribution request for ${stack.item.name}`,
        farmLocation: farmLocations[i % farmLocations.length],
        areaPlanted: parseFloat((quantity / 20).toFixed(2)), // ~20kg per hectare
        plantingMethod: plantingMethods[i % plantingMethods.length],
        plantingReportRequired: true,
        plantingReportDeadline: plantingDeadline || null,
        statusChangeReason: ['Rejected', 'Cancelled'].includes(status) ? 'Sample reason for status' : null,
        createdAt: requestDate,
        updatedAt: actualPickup || requestDate,
      });
    }
  }

  await prisma.itemTransaction.createMany({ 
    data: distributionTransactions,
    skipDuplicates: true 
  });

  console.log(`✅ Created ${distributionTransactions.length} Distribution transactions (2 per status)`);
  console.log(`   Total transactions: ${eicTransactions.length + distributionTransactions.length}`);

  return [...eicTransactions, ...distributionTransactions];
}
