/**
 * Inventory Items Seed Script
 * Creates 6 different types of farming equipment with 1-5 stacks each
 */

export async function seedInventoryItems(prisma) {
  const items = [
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

  // Use createMany for batch insert
  await prisma.inventoryItem.createMany({
    data: items,
    skipDuplicates: true,
  });

  // Fetch created items to return
  const createdItems = await prisma.inventoryItem.findMany({
    where: {
      name: { in: items.map(i => i.name) }
    }
  });

  console.log(`✅ Created ${createdItems.length} inventory items`);
  return createdItems;
}

export async function seedItemStacks(prisma) {
  const items = await prisma.inventoryItem.findMany({ select: { id: true, name: true } });
  
  // Define how many stacks per item (1-5 stacks)
  const stacksConfig = [
    { itemIndex: 0, stacks: 3 },  // Hand Tractor - 3 stacks
    { itemIndex: 1, stacks: 5 },  // Sprayer - 5 stacks
    { itemIndex: 2, stacks: 2 },  // Rice Thresher - 2 stacks
    { itemIndex: 3, stacks: 4 },  // Water Pump - 4 stacks
    { itemIndex: 4, stacks: 1 },  // Mechanical Dryer - 1 stack
    { itemIndex: 5, stacks: 3 },  // Corn Sheller - 3 stacks
  ];

  const statuses = ['Available', 'Unavailable', 'Damaged', 'EIC', 'Distributed'];
  const allStacks = [];

  for (const config of stacksConfig) {
    const item = items[config.itemIndex];
    if (!item) continue;

    for (let i = 0; i < config.stacks; i++) {
      const status = statuses[i % statuses.length]; // Rotate through statuses
      const quantity = status === 'Available' ? Math.floor(Math.random() * 10) + 5 :
                      status === 'Damaged' ? Math.floor(Math.random() * 3) :
                      Math.floor(Math.random() * 8) + 2;

      allStacks.push({
        itemId: item.id,
        quantity,
        status,
        date_limit: status === 'EIC' ? 30 : null, // 30-day limit for EIC items
      });
    }
  }

  // Use createMany for batch insert
  await prisma.itemStack.createMany({
    data: allStacks,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${allStacks.length} item stacks (1-5 stacks per item)`);
}

export async function seedItemTransactions(prisma) {
  // Transactions removed - not needed for initial seed
  console.log('⏭️  Skipping item transactions (can be added later if needed)');
}
