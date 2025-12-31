/**
 * Distribution Requests Seed Script
 * Creates sample distribution requests with Picked_Up status for planting report integration
 */

export async function seedDistributionRequests(prisma) {
  // Get distributed stacks with seed varieties
  const distributedStacks = await prisma.itemStack.findMany({
    where: {
      status: 'Distributed',
      item: {
        seedVarietyId: { not: null }
      }
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

  if (distributedStacks.length === 0) {
    console.log('⚠️  No distributed seed items found. Creating distributed stacks first...');
    
    // Create some seed items if they don't exist
    const seedVarieties = await prisma.seedVariety.findMany({ take: 3 });
    if (seedVarieties.length === 0) {
      console.log('⚠️  No seed varieties found. Skipping distribution requests.');
      return [];
    }

    // Create distributed seed items
    for (const variety of seedVarieties) {
      const item = await prisma.inventoryItem.create({
        data: {
          name: `${variety.name} Seeds`,
          description: `${variety.description}`,
          category: 'Seeds',
          unit: 'kg',
          seedVarietyId: variety.id
        }
      });

      await prisma.itemStack.create({
        data: {
          itemId: item.id,
          quantity: 500,
          status: 'Distributed',
          max_quantity_per_request: 50
        }
      });
    }

    // Re-fetch distributed stacks
    const newStacks = await prisma.itemStack.findMany({
      where: {
        status: 'Distributed',
        item: {
          seedVarietyId: { not: null }
        }
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

    if (newStacks.length === 0) {
      console.log('⚠️  Failed to create distributed stacks. Skipping distribution requests.');
      return [];
    }

    distributedStacks.push(...newStacks);
  }

  // Get regular user accounts (not admin)
  const users = await prisma.account.findMany({
    where: {
      access: 'User'
    },
    take: 8
  });

  if (users.length === 0) {
    console.log('⚠️  No regular users found. Skipping distribution requests.');
    return [];
  }

  const plantingMethods = ['Direct_Seeded', 'Transplanting'];
  const farmLocations = [
    'Barangay San Jose, Nueva Ecija',
    'Barangay Poblacion, Bulacan',
    'Barangay Malaya, Pampanga',
    'Barangay Rizal, Tarlac',
    'Barangay Luna, Nueva Ecija',
    'Barangay Burgos, Bulacan',
    'Barangay Mabini, Pampanga',
    'Barangay Del Pilar, Tarlac'
  ];

  const transactions = [];

  // Create distribution requests with Picked_Up status (ready for planting reports)
  for (let i = 0; i < Math.min(8, users.length, distributedStacks.length); i++) {
    const user = users[i];
    const stack = distributedStacks[i % distributedStacks.length];
    const quantity = Math.floor(Math.random() * 30) + 10; // 10-40 kg
    const areaPlanted = (quantity / 20).toFixed(2); // Approximate hectares (20kg per hectare)
    
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() - Math.floor(Math.random() * 30)); // Picked up in last 30 days
    
    const actualPickup = new Date(pickupDate);
    actualPickup.setHours(actualPickup.getHours() + Math.floor(Math.random() * 24));

    // Calculate planting deadline based on variety's planting window
    const plantingDeadline = new Date(actualPickup);
    const plantingWindowDays = stack.item.seedVariety?.plantingWindow || 30;
    plantingDeadline.setDate(plantingDeadline.getDate() + plantingWindowDays);

    transactions.push({
      itemStackId: stack.id,
      accountId: user.id,
      quantity,
      status: 'Picked_Up',
      pickupDate,
      actual_pickup: actualPickup,
      requestNote: `Distribution request for ${stack.item.name}`,
      farmLocation: farmLocations[i % farmLocations.length],
      areaPlanted: parseFloat(areaPlanted),
      plantingMethod: plantingMethods[i % plantingMethods.length],
      plantingReportRequired: true,
      plantingReportDeadline: plantingDeadline,
      createdAt: new Date(Date.now() - (i + 1) * 86400000), // Stagger creation dates
      updatedAt: actualPickup
    });
  }

  // Create the transactions
  const createdTransactions = [];
  for (const txn of transactions) {
    try {
      const created = await prisma.itemTransaction.create({
        data: txn
      });
      createdTransactions.push(created);
    } catch (error) {
      console.error(`Error creating distribution request:`, error.message);
    }
  }

  console.log(`✅ Created ${createdTransactions.length} distribution requests (Picked_Up status)`);
  return createdTransactions;
}
