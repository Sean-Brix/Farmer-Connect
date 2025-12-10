import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script for creating diverse test request data for both EIC and Distribution
 * Creates requests spanning past, present, and future dates with various statuses
 */

async function seedRequests() {
  console.log('🌱 Starting comprehensive request seeding...\n');

  try {
    // Get all item stacks for EIC and Distribution
    const eicStacks = await prisma.itemStack.findMany({
      where: { status: 'EIC' },
      include: { item: true }
    });

    const distributionStacks = await prisma.itemStack.findMany({
      where: { status: 'Distributed' },
      include: { item: true }
    });

    // Get multiple user accounts (different profiles)
    const users = await prisma.account.findMany({
      where: { 
        access: 'User'
      },
      take: 5 // Use 5 different users for diversity
    });
    
    if (users.length === 0) {
      console.log('❌ No user accounts found. Please seed accounts first.');
      return;
    }

    // Get admin accounts
    const admins = await prisma.account.findMany({
      where: { access: { in: ['Admin', 'Super_Admin'] } }
    });

    if (eicStacks.length === 0 && distributionStacks.length === 0) {
      console.log('❌ No item stacks found. Please seed inventory first.');
      return;
    }

    console.log(`📊 Found ${users.length} users, ${eicStacks.length} EIC stacks, ${distributionStacks.length} Distribution stacks\n`);

    // Delete existing transactions for clean slate
    const deleted = await prisma.itemTransaction.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.count} existing transactions\n`);

    const now = new Date();
    let totalCreated = 0;

    // Helper function to get random element from array
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Helper function to get date offset
    const getDateOffset = (daysOffset) => {
      const date = new Date(now);
      date.setDate(date.getDate() + daysOffset);
      return date;
    };

    // Define comprehensive scenarios per user - Max 3 active (Pending, Approved, Borrowed, late_pickup) per user
    // Each user can have unlimited archived requests
    const scenariosPerUser = {
      // User 1: Diverse active requests + archived history
      user1: [
        // ACTIVE (3 max)
        { type: 'EIC', status: 'Pending', pickupDays: 2, returnDays: 9, quantity: 1, note: 'Need tractor for planting', adminRequired: false },
        { type: 'EIC', status: 'Approved', pickupDays: 1, returnDays: 8, quantity: 1, note: 'Water pump approved', adminRequired: true },
        { type: 'EIC', status: 'Borrowed', pickupDays: -3, returnDays: 4, quantity: 1, note: 'Currently using harvester', adminRequired: true, actual_pickup: -3 },
        
        // ARCHIVED (multiple allowed)
        { type: 'EIC', status: 'Returned', pickupDays: -30, returnDays: -25, quantity: 1, note: 'Previous rental completed', adminRequired: true, actual_pickup: -30, actual_return: -25 },
        { type: 'EIC', status: 'Returned', pickupDays: -60, returnDays: -55, quantity: 1, note: 'Older completed request', adminRequired: true, actual_pickup: -60, actual_return: -55 },
        { type: 'EIC', status: 'late_return', pickupDays: -45, returnDays: -35, quantity: 1, note: 'Returned 5 days late', adminRequired: true, actual_pickup: -45, actual_return: -30, adjustedReturnDays: -35 },
        { type: 'EIC', status: 'Cancelled', pickupDays: -20, returnDays: -15, quantity: 1, note: 'Changed plans', adminRequired: false },
        { type: 'DIST', status: 'Returned', pickupDays: -40, returnDays: null, quantity: 5, note: 'Received seeds last month', adminRequired: true, actual_pickup: -40 },
      ],
      
      // User 2: Focus on late scenarios
      user2: [
        // ACTIVE (3 max)
        { type: 'EIC', status: 'Pending', pickupDays: -1, returnDays: 6, quantity: 1, note: 'Pickup overdue by 1 day - needs approval', adminRequired: false },
        { type: 'EIC', status: 'Approved', pickupDays: -2, returnDays: 5, quantity: 1, note: 'Approved but pickup 2 days late', adminRequired: true },
        { type: 'EIC', status: 'late_pickup', pickupDays: -10, returnDays: 2, quantity: 1, note: 'Picked up 3 days late', adminRequired: true, actual_pickup: -7, adjustedReturnDays: 5 },
        
        // ARCHIVED
        { type: 'EIC', status: 'No_Pickup', pickupDays: -15, returnDays: -10, quantity: 1, note: 'Approved but never collected', adminRequired: true },
        { type: 'EIC', status: 'No_Return', pickupDays: -50, returnDays: -45, quantity: 1, note: 'Equipment lost', adminRequired: true, actual_pickup: -50 },
        { type: 'EIC', status: 'Rejected', pickupDays: -25, returnDays: -20, quantity: 5, note: 'Too many items requested', adminRequired: true },
        { type: 'DIST', status: 'No_Pickup', pickupDays: -12, returnDays: null, quantity: 10, note: 'Seeds approved but not claimed', adminRequired: true },
      ],
      
      // User 3: Overdue return scenarios
      user3: [
        // ACTIVE (3 max)
        { type: 'EIC', status: 'Pending', pickupDays: 3, returnDays: 10, quantity: 1, note: 'Requesting irrigation system', adminRequired: false },
        { type: 'EIC', status: 'Borrowed', pickupDays: -10, returnDays: -1, quantity: 1, note: 'OVERDUE by 1 day', adminRequired: true, actual_pickup: -10 },
        { type: 'EIC', status: 'Borrowed', pickupDays: -15, returnDays: -5, quantity: 1, note: 'OVERDUE by 5 days', adminRequired: true, actual_pickup: -15 },
        
        // ARCHIVED
        { type: 'EIC', status: 'Returned', pickupDays: -35, returnDays: -30, quantity: 1, note: 'Past successful return', adminRequired: true, actual_pickup: -35, actual_return: -30 },
        { type: 'EIC', status: 'late_return', pickupDays: -50, returnDays: -40, quantity: 1, note: 'Returned 7 days late', adminRequired: true, actual_pickup: -50, actual_return: -33, adjustedReturnDays: -40 },
        { type: 'DIST', status: 'Cancelled', pickupDays: -18, returnDays: null, quantity: 3, note: 'Cancelled seed order', adminRequired: false },
      ],
      
      // User 4: Near deadline scenarios
      user4: [
        // ACTIVE (3 max)
        { type: 'EIC', status: 'Approved', pickupDays: 0, returnDays: 7, quantity: 1, note: 'Pickup TODAY', adminRequired: true },
        { type: 'EIC', status: 'Borrowed', pickupDays: -6, returnDays: 1, quantity: 1, note: 'Due tomorrow', adminRequired: true, actual_pickup: -6 },
        { type: 'EIC', status: 'Borrowed', pickupDays: -7, returnDays: 0, quantity: 1, note: 'Due TODAY', adminRequired: true, actual_pickup: -7 },
        
        // ARCHIVED
        { type: 'EIC', status: 'Returned', pickupDays: -25, returnDays: -20, quantity: 1, note: 'On-time return', adminRequired: true, actual_pickup: -25, actual_return: -20 },
        { type: 'EIC', status: 'Rejected', pickupDays: -10, returnDays: -5, quantity: 2, note: 'Item unavailable', adminRequired: true },
        { type: 'DIST', status: 'Returned', pickupDays: -30, returnDays: null, quantity: 8, note: 'Seed distribution completed', adminRequired: true, actual_pickup: -30 },
      ],
      
      // User 5: Mixed scenarios
      user5: [
        // ACTIVE (3 max)
        { type: 'EIC', status: 'Pending', pickupDays: 5, returnDays: 12, quantity: 1, note: 'Future request', adminRequired: false },
        { type: 'EIC', status: 'Approved', pickupDays: 2, returnDays: 9, quantity: 1, note: 'Ready in 2 days', adminRequired: true },
        { type: 'EIC', status: 'late_pickup', pickupDays: -12, returnDays: -1, quantity: 1, note: 'Late pickup AND now overdue', adminRequired: true, actual_pickup: -9, adjustedReturnDays: 2 },
        
        // ARCHIVED
        { type: 'EIC', status: 'Returned', pickupDays: -40, returnDays: -35, quantity: 1, note: 'Completed rental', adminRequired: true, actual_pickup: -40, actual_return: -35 },
        { type: 'EIC', status: 'Cancelled', pickupDays: -8, returnDays: -3, quantity: 1, note: 'User cancelled early', adminRequired: false },
        { type: 'DIST', status: 'Rejected', pickupDays: -22, returnDays: null, quantity: 15, note: 'Stock insufficient', adminRequired: true },
      ],
    };

    // Create transactions for each user
    const userKeys = Object.keys(scenariosPerUser);
    const usedStacks = new Set(); // Track used item stacks to avoid duplicates per user
    
    for (let i = 0; i < Math.min(users.length, userKeys.length); i++) {
      const user = users[i];
      const userKey = userKeys[i];
      const scenarios = scenariosPerUser[userKey];
      
      console.log(`\n👤 Creating requests for User ${i + 1} (${user.username}):`);
      
      for (const scenario of scenarios) {
        const stacks = scenario.type === 'EIC' ? eicStacks : distributionStacks;
        
        if (stacks.length === 0) continue;

        // Find an available stack not yet used for this user's active requests
        let stack;
        let attempts = 0;
        do {
          stack = getRandom(stacks);
          attempts++;
        } while (usedStacks.has(`${user.id}-${stack.id}`) && attempts < 10);
        
        // Mark as used if it's an active request (not archived)
        if (!['Returned', 'late_return', 'No_Return', 'No_Pickup', 'Rejected', 'Cancelled'].includes(scenario.status)) {
          usedStacks.add(`${user.id}-${stack.id}`);
        }

        const admin = scenario.adminRequired && admins.length > 0 ? getRandom(admins) : null;

        const pickupDate = getDateOffset(scenario.pickupDays);
        const returnDate = scenario.returnDays !== null ? getDateOffset(scenario.returnDays) : null;

        // Calculate dates for special statuses
        const actual_pickup = scenario.actual_pickup !== undefined ? getDateOffset(scenario.actual_pickup) : null;
        const actual_return = scenario.actual_return !== undefined ? getDateOffset(scenario.actual_return) : null;
        const adjustedReturnDate = scenario.adjustedReturnDays !== undefined ? getDateOffset(scenario.adjustedReturnDays) : null;

        try {
          await prisma.itemTransaction.create({
            data: {
              itemStackId: stack.id,
              accountId: user.id,
              adminId: admin?.id || null,
              quantity: scenario.quantity,
              status: scenario.status,
              pickupDate: pickupDate,
              returnDate: returnDate,
              requestNote: scenario.note,
              actual_pickup: actual_pickup,
              actual_return: actual_return,
              adjustedReturnDate: adjustedReturnDate,
            }
          });

          totalCreated++;
          const statusIcon = ['Returned', 'Approved'].includes(scenario.status) ? '✅' : 
                           ['Pending'].includes(scenario.status) ? '⏳' :
                           ['Borrowed', 'late_pickup'].includes(scenario.status) ? '📦' :
                           ['Rejected', 'Cancelled'].includes(scenario.status) ? '❌' : '⚠️';
          console.log(`   ${statusIcon} ${scenario.type} - ${scenario.status} - ${stack.item.name}`);
        } catch (error) {
          console.error(`   ❌ Failed to create ${scenario.type} ${scenario.status}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Successfully created ${totalCreated} test requests!`);
    console.log('\n📊 Summary:');
    
    const statusCounts = await prisma.itemTransaction.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    statusCounts.forEach(({ status, _count }) => {
      console.log(`   ${status}: ${_count.status}`);
    });

  } catch (error) {
    console.error('❌ Error seeding requests:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedRequests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
