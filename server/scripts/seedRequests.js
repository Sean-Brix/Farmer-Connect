import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script for creating diverse test request data for both EIC and Distribution
 * Creates requests spanning past, present, and future dates with various statuses
 */

async function seedRequests() {
  console.log('🌱 Starting request seeding...\n');

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

    // Get user accounts
    const users = await prisma.account.findMany({
      where: { access: 'User' }
    });

    // Get admin accounts
    const admins = await prisma.account.findMany({
      where: { access: { in: ['Admin', 'Super_Admin'] } }
    });

    if (users.length === 0) {
      console.log('❌ No users found. Please seed accounts first.');
      return;
    }

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

    // Define request scenarios
    const scenarios = [
      // PAST COMPLETED (EIC)
      { type: 'EIC', status: 'Returned', pickupDays: -30, returnDays: -25, quantity: 2, note: 'Returned on time', adminRequired: true },
      { type: 'EIC', status: 'Returned', pickupDays: -20, returnDays: -15, quantity: 1, note: 'Equipment in good condition', adminRequired: true },
      { type: 'EIC', status: 'Returned', pickupDays: -15, returnDays: -10, quantity: 3, note: null, adminRequired: true },
      
      // PAST LATE RETURNS (EIC)
      { type: 'EIC', status: 'late_return', pickupDays: -40, returnDays: -10, quantity: 1, note: 'Needed extra time', adminRequired: true },
      { type: 'EIC', status: 'late_return', pickupDays: -35, returnDays: -5, quantity: 2, note: 'Equipment was damaged slightly', adminRequired: true },
      
      // PAST NO RETURNS (EIC)
      { type: 'EIC', status: 'No_Return', pickupDays: -50, returnDays: -45, quantity: 1, note: 'Lost equipment', adminRequired: true },
      
      // PAST REJECTED
      { type: 'EIC', status: 'Rejected', pickupDays: -25, returnDays: -20, quantity: 5, note: 'Request for too many items', adminRequired: true },
      { type: 'DIST', status: 'Rejected', pickupDays: -18, returnDays: null, quantity: 10, note: 'Insufficient stock', adminRequired: true },
      
      // PAST NO PICKUP
      { type: 'EIC', status: 'No_Pickup', pickupDays: -12, returnDays: -7, quantity: 1, note: 'Did not show up', adminRequired: true },
      { type: 'DIST', status: 'No_Pickup', pickupDays: -8, returnDays: null, quantity: 5, note: 'Did not claim seeds', adminRequired: true },
      
      // PAST CANCELLED
      { type: 'EIC', status: 'Cancelled', pickupDays: -10, returnDays: -5, quantity: 2, note: 'User cancelled request', adminRequired: false },
      { type: 'DIST', status: 'Cancelled', pickupDays: -6, returnDays: null, quantity: 3, note: 'Changed mind', adminRequired: false },
      
      // PAST PICKED UP - Removed (No 'Picked_Up' status in enum)
      // Distribution items that are picked up should remain as 'Approved'
      
      // RECENT APPROVED - WAITING FOR PICKUP (Next 7 days)
      { type: 'EIC', status: 'Approved', pickupDays: 1, returnDays: 8, quantity: 1, note: 'Need for farm work tomorrow', adminRequired: true },
      { type: 'EIC', status: 'Approved', pickupDays: 2, returnDays: 9, quantity: 2, note: 'Plowing equipment', adminRequired: true },
      { type: 'EIC', status: 'Approved', pickupDays: 3, returnDays: 10, quantity: 1, note: null, adminRequired: true },
      { type: 'DIST', status: 'Approved', pickupDays: 1, returnDays: null, quantity: 8, note: 'Rice seeds for next week', adminRequired: true },
      { type: 'DIST', status: 'Approved', pickupDays: 2, returnDays: null, quantity: 5, note: 'Vegetable seeds', adminRequired: true },
      { type: 'DIST', status: 'Approved', pickupDays: 4, returnDays: null, quantity: 12, note: 'Corn seeds approved', adminRequired: true },
      { type: 'DIST', status: 'Approved', pickupDays: 5, returnDays: null, quantity: 6, note: null, adminRequired: true },
      
      // CURRENT PENDING REQUESTS (Today and next few days)
      { type: 'EIC', status: 'Pending', pickupDays: 0, returnDays: 7, quantity: 1, note: 'Urgent need for today', adminRequired: false },
      { type: 'EIC', status: 'Pending', pickupDays: 1, returnDays: 8, quantity: 2, note: 'Need tractor tomorrow', adminRequired: false },
      { type: 'EIC', status: 'Pending', pickupDays: 2, returnDays: 9, quantity: 1, note: 'Water pump needed', adminRequired: false },
      { type: 'EIC', status: 'Pending', pickupDays: 3, returnDays: 10, quantity: 3, note: null, adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 0, returnDays: null, quantity: 10, note: 'Need seeds ASAP', adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 1, returnDays: null, quantity: 5, note: 'Tomato seeds request', adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 2, returnDays: null, quantity: 7, note: 'Corn seeds for planting', adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 3, returnDays: null, quantity: 4, note: null, adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 4, returnDays: null, quantity: 8, note: 'Rice seeds needed', adminRequired: false },
      
      // FUTURE APPROVED (Next 2-3 weeks)
      { type: 'EIC', status: 'Approved', pickupDays: 10, returnDays: 17, quantity: 2, note: 'Scheduled pickup next week', adminRequired: true },
      { type: 'EIC', status: 'Approved', pickupDays: 14, returnDays: 21, quantity: 1, note: 'Equipment for harvest season', adminRequired: true },
      { type: 'DIST', status: 'Approved', pickupDays: 12, returnDays: null, quantity: 15, note: 'Large seed order', adminRequired: true },
      { type: 'DIST', status: 'Approved', pickupDays: 18, returnDays: null, quantity: 9, note: 'Pre-ordered seeds', adminRequired: true },
      
      // FUTURE PENDING (Next 2-4 weeks)
      { type: 'EIC', status: 'Pending', pickupDays: 15, returnDays: 22, quantity: 1, note: 'Advance booking for harvest', adminRequired: false },
      { type: 'EIC', status: 'Pending', pickupDays: 20, returnDays: 27, quantity: 2, note: 'Planning ahead', adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 16, returnDays: null, quantity: 10, note: 'Future planting season', adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 21, returnDays: null, quantity: 6, note: 'Pre-order for next month', adminRequired: false },
      { type: 'DIST', status: 'Pending', pickupDays: 25, returnDays: null, quantity: 12, note: null, adminRequired: false },
    ];

    // Create transactions based on scenarios
    for (const scenario of scenarios) {
      const stacks = scenario.type === 'EIC' ? eicStacks : distributionStacks;
      
      if (stacks.length === 0) continue;

      const stack = getRandom(stacks);
      const user = getRandom(users);
      const admin = scenario.adminRequired && admins.length > 0 ? getRandom(admins) : null;

      const pickupDate = getDateOffset(scenario.pickupDays);
      const returnDate = scenario.returnDays !== null ? getDateOffset(scenario.returnDays) : null;

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
          }
        });

        totalCreated++;
        console.log(`✅ ${scenario.type} - ${scenario.status} - Pickup: ${pickupDate.toLocaleDateString()}`);
      } catch (error) {
        console.error(`❌ Failed to create ${scenario.type} ${scenario.status}:`, error.message);
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
