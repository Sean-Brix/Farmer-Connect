/**
 * Seminars Seed Script
 * Creates 5-6 realistic agricultural training seminars
 */

export async function seedSeminars(prisma) {
  const admins = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } },
    select: { id: true }
  });
  
  const adminId = admins.length > 0 ? admins[0].id : null;

  // Calculate dates
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const twoMonthsAhead = new Date(now);
  twoMonthsAhead.setMonth(twoMonthsAhead.getMonth() + 2);
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const seminars = [
    {
      title: 'Climate-Smart Rice Farming Techniques',
      description: 'Learn sustainable rice cultivation methods that adapt to changing weather patterns. Topics include water management, drought-resistant varieties, and integrated pest management.',
      location: 'Municipal Agriculture Office - Main Hall',
      speaker: 'Dr. Maria Santos - Agricultural Extension Specialist',
      start_date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15, 9, 0),
      end_date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15, 17, 0),
      start_time: '09:00',
      end_time: '17:00',
      capacity: 50,
      registration_deadline: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 10),
      status: 'Upcoming',
      createdById: adminId,
    },
    {
      title: 'Organic Vegetable Production and Marketing',
      description: 'Comprehensive training on organic vegetable farming from seed selection to market linkage. Includes hands-on field demonstration and certification process.',
      location: 'Barangay San Isidro Community Center',
      speaker: 'Engr. Roberto Cruz - Organic Agriculture Consultant',
      start_date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 22, 8, 0),
      end_date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 23, 16, 0),
      start_time: '08:00',
      end_time: '16:00',
      capacity: 40,
      registration_deadline: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 18),
      status: 'Upcoming',
      createdById: adminId,
    },
    {
      title: 'Modern Irrigation Systems and Water Conservation',
      description: 'Training on drip irrigation, sprinkler systems, and rainwater harvesting techniques. Learn to maximize water efficiency and reduce production costs.',
      location: 'Agricultural Training Center - Field Demo Area',
      speaker: 'Engr. Juan Dela Cruz - Irrigation Engineer',
      start_date: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 5, 13, 0),
      end_date: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 5, 17, 0),
      start_time: '13:00',
      end_time: '17:00',
      capacity: 35,
      registration_deadline: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 1),
      status: 'Upcoming',
      createdById: adminId,
    },
    {
      title: 'Financial Literacy for Farmers: Budgeting and Record Keeping',
      description: 'Essential financial management skills for farm businesses. Topics include farm budgeting, cost analysis, record keeping, and accessing agricultural loans.',
      location: 'Rural Bank Conference Room',
      speaker: 'Ms. Ana Martinez - Agricultural Loan Officer',
      start_date: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 12, 9, 0),
      end_date: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 12, 15, 0),
      start_time: '09:00',
      end_time: '15:00',
      capacity: 60,
      registration_deadline: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 8),
      status: 'Upcoming',
      createdById: adminId,
    },
    {
      title: 'Post-Harvest Handling and Value Addition',
      description: 'Reduce post-harvest losses and add value to your products. Learn proper drying, storage, packaging, and basic food processing techniques.',
      location: 'Municipal Agriculture Office - Training Room',
      speaker: 'Prof. Elena Torres - Food Technology Expert',
      start_date: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 20, 8, 30),
      end_date: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 20, 16, 30),
      start_time: '08:30',
      end_time: '16:30',
      capacity: 45,
      registration_deadline: new Date(twoMonthsAhead.getFullYear(), twoMonthsAhead.getMonth(), 15),
      status: 'Upcoming',
      createdById: adminId,
    },
    {
      title: 'Integrated Pest Management for Rice and Corn',
      description: 'Practical approaches to managing pests using biological controls, cultural practices, and minimal chemical intervention. Field demonstration included.',
      location: 'Barangay Demonstration Farm',
      speaker: 'Dr. Carlos Mendoza - Plant Pathologist',
      start_date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 20, 9, 0),
      end_date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 20, 17, 0),
      start_time: '09:00',
      end_time: '17:00',
      capacity: 50,
      registration_deadline: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 15),
      status: 'Completed',
      createdById: adminId,
    },
  ];

  // Use createMany for batch insert
  await prisma.seminar.createMany({
    data: seminars,
    skipDuplicates: true,
  });

  // Fetch created seminars
  const createdSeminars = await prisma.seminar.findMany({
    where: {
      title: { in: seminars.map(s => s.title) }
    }
  });

  console.log(`✅ Created ${createdSeminars.length} seminars (${seminars.filter(s => s.status === 'Upcoming').length} upcoming, ${seminars.filter(s => s.status === 'Completed').length} completed)`);
  return createdSeminars;
}

export async function seedSeminarParticipants(prisma) {
  // Participants removed - not needed for initial seed
  console.log('⏭️  Skipping seminar participants (can be added later if needed)');
}
