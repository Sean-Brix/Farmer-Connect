import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// Import data files
import users from './Data/account.json' with { type: 'json' };

console.log('🌱 Starting comprehensive database seeding...\n');

//? ========================================= UTILITIES ========================================= ?//

async function loadImage(imagePath) {
  try {
    if (fs.existsSync(imagePath)) {
      return await sharp(imagePath).resize(300).jpeg({ quality: 80 }).toBuffer();
    }
  } catch (error) {
    console.error(`Error loading image ${imagePath}:`, error.message);
  }
  return null;
}

//? ========================================= ACCOUNTS ========================================= ?//

async function createAccounts() {
  console.log('📝 Creating accounts...');
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const existingUser = await prisma.account.findUnique({
      where: { username: user.username }
    });
    
    if (existingUser) {
      console.log(`  ⏭️  User ${user.username} already exists, skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    // Try to load profile picture
    let picture = null;
    if (i < 13) {
      const imageIndex = i + 1;
      const imageName = `sample${imageIndex}${imageIndex === 2 ? '.jpeg' : imageIndex === 3 ? '.png' : '.jpg'}`;
      const imagePath = path.join(__dirname, '/Data/images/Accounts', imageName);
      picture = await loadImage(imagePath);
    }

    await prisma.account.create({
      data: {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        access: user.access,
        firstName: user.firstName,
        middleName: user.middleName,
        surname: user.surname,
        extensionName: user.extensionName,
        sex: user.sex,
        contactNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
        picturePath: picture ? `/uploads/profile/${user.username}.jpg` : null,
        client_profile: user.client_profile,
      }
    });

    console.log(`  ✅ Created ${user.access}: ${user.username}`);
    await wait(100);
  }
  
  const accountCount = await prisma.account.count();
  console.log(`✅ Total accounts created: ${accountCount}\n`);
}

//? ========================================= SEMINARS ========================================= ?//

async function createSeminars() {
  console.log('📚 Creating seminars...');
  
  const adminAccounts = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } }
  });

  const seminarData = [
    {
      title: "Sustainable Rice Farming Techniques",
      description: "Learn modern and sustainable practices for rice cultivation, including water management and organic pest control methods.",
      location: "Lipa City Agricultural Center",
      speaker: "Dr. Maria Santos, Agricultural Specialist",
      start_date: new Date('2024-11-15'),
      end_date: new Date('2024-11-15'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 50,
      registration_deadline: new Date('2024-11-10'),
      status: "Completed"
    },
    {
      title: "Integrated Pest Management for Vegetables",
      description: "Comprehensive training on identifying and managing common pests in vegetable crops using integrated approaches.",
      location: "Tanauan City Extension Office",
      speaker: "Engr. Juan Reyes, Plant Protection Officer",
      start_date: new Date('2024-12-05'),
      end_date: new Date('2024-12-05'),
      start_time: "09:00 AM",
      end_time: "04:00 PM",
      capacity: 40,
      registration_deadline: new Date('2024-12-01'),
      status: "Completed"
    },
    {
      title: "Modern Irrigation Systems Workshop",
      description: "Hands-on training on installation and maintenance of drip irrigation and sprinkler systems for efficient water use.",
      location: "Santo Tomas Demo Farm",
      speaker: "Engr. Roberto Cruz, Irrigation Engineer",
      start_date: new Date('2024-12-20'),
      end_date: new Date('2024-12-21'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 30,
      registration_deadline: new Date('2024-12-15'),
      status: "Ongoing"
    },
    {
      title: "Organic Fertilizer Production",
      description: "Learn how to produce your own organic fertilizers using farm waste and available materials.",
      location: "Malvar Agricultural Training Center",
      speaker: "Dr. Linda Villanueva, Soil Scientist",
      start_date: new Date('2025-01-10'),
      end_date: new Date('2025-01-10'),
      start_time: "08:30 AM",
      end_time: "03:30 PM",
      capacity: 45,
      registration_deadline: new Date('2025-01-05'),
      status: "Upcoming"
    },
    {
      title: "Post-Harvest Handling and Storage",
      description: "Best practices for handling, processing, and storing agricultural products to reduce post-harvest losses.",
      location: "Balete Municipal Hall",
      speaker: "Ms. Rosa Mendoza, Food Technologist",
      start_date: new Date('2025-01-25'),
      end_date: new Date('2025-01-25'),
      start_time: "09:00 AM",
      end_time: "04:00 PM",
      capacity: 35,
      registration_deadline: new Date('2025-01-20'),
      status: "Upcoming"
    },
    {
      title: "Climate-Smart Agriculture",
      description: "Adaptation strategies for farming in changing climate conditions, including drought-resistant varieties and water conservation.",
      location: "Lipa City Convention Center",
      speaker: "Dr. Pedro Santos, Climate Specialist",
      start_date: new Date('2025-02-08'),
      end_date: new Date('2025-02-08'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 60,
      registration_deadline: new Date('2025-02-03'),
      status: "Upcoming"
    },
    {
      title: "High-Value Crops Production",
      description: "Training on cultivating high-value crops like dragon fruit, lettuce, and specialty vegetables for better farm income.",
      location: "Tanauan Agri Hub",
      speaker: "Engr. Carlos Mercado, Horticulture Expert",
      start_date: new Date('2025-02-20'),
      end_date: new Date('2025-02-21'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 40,
      registration_deadline: new Date('2025-02-15'),
      status: "Upcoming"
    },
    {
      title: "Farm Business Management",
      description: "Learn basic accounting, budgeting, and financial management for your farm operations.",
      location: "Batangas City Trade Center",
      speaker: "Ms. Elena Santiago, Agricultural Economist",
      start_date: new Date('2025-03-05'),
      end_date: new Date('2025-03-05'),
      start_time: "09:00 AM",
      end_time: "04:00 PM",
      capacity: 50,
      registration_deadline: new Date('2025-02-28'),
      status: "Upcoming"
    },
    {
      title: "Organic Certification Process",
      description: "Understanding the requirements and steps for organic certification of your farm products.",
      location: "Santo Tomas Municipal Office",
      speaker: "Dr. Miguel Reyes, Organic Agriculture Specialist",
      start_date: new Date('2025-03-18'),
      end_date: new Date('2025-03-18'),
      start_time: "08:30 AM",
      end_time: "03:30 PM",
      capacity: 35,
      registration_deadline: new Date('2025-03-13'),
      status: "Upcoming"
    },
    {
      title: "Livestock Management Basics",
      description: "Introduction to proper care, feeding, and disease prevention for poultry, pigs, and small ruminants.",
      location: "Malvar Livestock Center",
      speaker: "Dr. Jose Bautista, Veterinarian",
      start_date: new Date('2025-04-02'),
      end_date: new Date('2025-04-02'),
      start_time: "08:00 AM",
      end_time: "04:00 PM",
      capacity: 45,
      registration_deadline: new Date('2025-03-28'),
      status: "Upcoming"
    },
    {
      title: "Aquaponics System Setup",
      description: "Learn to integrate fish farming with vegetable production in a sustainable closed-loop system.",
      location: "Mabini Coastal Center",
      speaker: "Engr. Sofia Martinez, Aquaculture Specialist",
      start_date: new Date('2025-04-15'),
      end_date: new Date('2025-04-16'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 25,
      registration_deadline: new Date('2025-04-10'),
      status: "Upcoming"
    },
    {
      title: "Agricultural Mechanization",
      description: "Overview of modern farm machinery and equipment, their uses, and maintenance requirements.",
      location: "Lipa City Agri Park",
      speaker: "Engr. Ricardo Domingo, Agricultural Engineer",
      start_date: new Date('2025-05-08'),
      end_date: new Date('2025-05-08'),
      start_time: "09:00 AM",
      end_time: "04:00 PM",
      capacity: 40,
      registration_deadline: new Date('2025-05-03'),
      status: "Upcoming"
    },
    {
      title: "Market Linkage and Product Marketing",
      description: "Strategies for connecting with buyers, pricing products, and marketing farm produce effectively.",
      location: "Batangas City Market Hall",
      speaker: "Ms. Lakambini Malaya, Marketing Specialist",
      start_date: new Date('2025-05-22'),
      end_date: new Date('2025-05-22'),
      start_time: "08:30 AM",
      end_time: "03:30 PM",
      capacity: 55,
      registration_deadline: new Date('2025-05-17'),
      status: "Upcoming"
    },
    {
      title: "Soil Health and Fertility Management",
      description: "Understanding soil types, testing, and improving soil health for optimal crop production.",
      location: "Tanauan Research Station",
      speaker: "Dr. Ana Cruz, Soil Science Professor",
      start_date: new Date('2025-06-05'),
      end_date: new Date('2025-06-05'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 40,
      registration_deadline: new Date('2025-05-30'),
      status: "Upcoming"
    },
    {
      title: "Seed Production and Quality Control",
      description: "Training on producing high-quality seeds and maintaining seed purity for better crop yields.",
      location: "Santo Tomas Seed Center",
      speaker: "Engr. Teresa Bautista, Seed Technologist",
      start_date: new Date('2025-06-20'),
      end_date: new Date('2025-06-21'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 30,
      registration_deadline: new Date('2025-06-15'),
      status: "Upcoming"
    },
    {
      title: "Farm Safety and Risk Management",
      description: "Essential safety practices, accident prevention, and risk mitigation strategies for farm operations.",
      location: "Lipa City Safety Training Center",
      speaker: "Engr. Luisa Mercado, Safety Officer",
      start_date: new Date('2025-07-08'),
      end_date: new Date('2025-07-08'),
      start_time: "09:00 AM",
      end_time: "04:00 PM",
      capacity: 45,
      registration_deadline: new Date('2025-07-03'),
      status: "Upcoming"
    },
    {
      title: "Mushroom Cultivation Workshop",
      description: "Hands-on training on oyster and shiitake mushroom production for additional farm income.",
      location: "Malvar Training Facility",
      speaker: "Ms. Maria Reyes, Mushroom Grower",
      start_date: new Date('2025-07-25'),
      end_date: new Date('2025-07-26'),
      start_time: "08:00 AM",
      end_time: "05:00 PM",
      capacity: 35,
      registration_deadline: new Date('2025-07-20'),
      status: "Upcoming"
    },
    {
      title: "Digital Agriculture and Farm Apps",
      description: "Introduction to mobile apps and digital tools for farm management, weather monitoring, and market access.",
      location: "Batangas City ICT Center",
      speaker: "Mr. Ramon Garcia, Agri-Tech Specialist",
      start_date: new Date('2025-08-10'),
      end_date: new Date('2025-08-10'),
      start_time: "08:30 AM",
      end_time: "03:30 PM",
      capacity: 50,
      registration_deadline: new Date('2025-08-05'),
      status: "Upcoming"
    }
  ];

  for (const seminar of seminarData) {
    const randomAdmin = faker.helpers.arrayElement(adminAccounts);
    
    await prisma.seminar.create({
      data: {
        ...seminar,
        createdById: randomAdmin.id,
        createdAt: faker.date.between({
          from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          to: new Date()
        })
      }
    });
  }

  console.log(`✅ Created ${seminarData.length} seminars\n`);
}

//? ================================= SEMINAR PARTICIPANTS ================================= ?//

async function createSeminarParticipants() {
  console.log('👥 Creating seminar participants...');
  
  const seminars = await prisma.seminar.findMany();
  const userAccounts = await prisma.account.findMany({
    where: { access: 'User' }
  });

  let totalParticipants = 0;

  for (const seminar of seminars) {
    // Determine participation based on seminar status
    let participationRate = 0.7; // 70% capacity for upcoming
    if (seminar.status === 'Completed') participationRate = 0.85;
    else if (seminar.status === 'Ongoing') participationRate = 0.75;
    else if (seminar.status === 'Cancelled') participationRate = 0.3;

    const numParticipants = Math.floor(seminar.capacity * participationRate);
    const shuffledUsers = faker.helpers.shuffle(userAccounts);

    for (let i = 0; i < Math.min(numParticipants, shuffledUsers.length); i++) {
      let status = 'Registered';

      if (seminar.status === 'Completed') {
        status = faker.helpers.arrayElement(['Attended', 'Attended', 'Attended', 'Not_Attended']);
      } else if (seminar.status === 'Cancelled') {
        status = 'Cancelled';
      }

      // Registration date should be between creation and registration deadline
      let registrationDate = new Date(seminar.createdAt);
      
      // Ensure createdAt is before registration_deadline
      if (seminar.createdAt < seminar.registration_deadline) {
        registrationDate = faker.date.between({
          from: new Date(seminar.createdAt),
          to: seminar.registration_deadline
        });
      }

      await prisma.seminarParticipant.create({
        data: {
          seminar_id: seminar.id,
          account_id: shuffledUsers[i].id,
          status: status,
          createdAt: registrationDate
        }
      });
      totalParticipants++;
    }
  }

  console.log(`✅ Created ${totalParticipants} seminar participants\n`);
}

//? =================================== INVENTORY ITEMS =================================== ?//

async function createInventoryItems() {
  console.log('📦 Creating inventory items...');
  
  const inventoryData = [
    { name: "Hand Tractor", description: "2-wheel hand tractor for plowing", category: "Farming_Equipment" },
    { name: "Water Pump", description: "Submersible water pump for irrigation", category: "Irrigation_Systems" },
    { name: "Knapsack Sprayer", description: "Manual backpack sprayer for pesticides", category: "Pest_Control" },
    { name: "Rice Harvester", description: "Manual rice harvesting tool", category: "Harvesting_Tools" },
    { name: "Corn Sheller", description: "Manual corn shelling machine", category: "Processing_Equipment" },
    { name: "Sickle", description: "Curved blade for harvesting crops", category: "Harvesting_Tools" },
    { name: "Hoe", description: "Garden hoe for weeding and soil cultivation", category: "Farming_Equipment" },
    { name: "Rake", description: "Metal garden rake", category: "Farming_Equipment" },
    { name: "Wheelbarrow", description: "Heavy-duty farm wheelbarrow", category: "Farming_Equipment" },
    { name: "Garden Gloves", description: "Protective gardening gloves", category: "Safety_Gear" },
    { name: "Rubber Boots", description: "Waterproof farm boots", category: "Safety_Gear" },
    { name: "Machete", description: "Large cutting tool for clearing", category: "Farming_Equipment" },
    { name: "Weighing Scale", description: "Digital weighing scale for produce", category: "Measuring_Tools" },
    { name: "Plastic Crates", description: "Stackable harvest crates", category: "Storage_Equipment" },
    { name: "Irrigation Hose", description: "50-meter flexible hose", category: "Irrigation_Systems" },
    { name: "Seedling Trays", description: "72-cell seedling tray", category: "Farming_Equipment" },
    { name: "Pruning Shears", description: "Sharp bypass pruner", category: "Farming_Equipment" },
    { name: "Fertilizer Spreader", description: "Manual fertilizer spreader", category: "Farming_Equipment" }
  ];

  for (const item of inventoryData) {
    const existing = await prisma.inventoryItem.findUnique({
      where: { name: item.name }
    });

    if (!existing) {
      await prisma.inventoryItem.create({
        data: item
      });
    }
  }

  console.log(`✅ Created ${inventoryData.length} inventory items\n`);
}

//? ==================================== ITEM STACKS ==================================== ?//

async function createItemStacks() {
  console.log('📊 Creating item stacks...');
  
  const inventoryItems = await prisma.inventoryItem.findMany();
  const statuses = ['Available', 'Unavailable', 'Damaged', 'EIC', 'Distributed'];
  let totalStacks = 0;

  for (const item of inventoryItems) {
    // Each item gets one stack per status
    for (const status of statuses) {
      let quantity = 0;
      let maxPerRequest = null;
      let dateLimit = null;

      if (status === 'Available') {
        quantity = faker.number.int({ min: 5, max: 30 });
      } else if (status === 'EIC') {
        quantity = faker.number.int({ min: 3, max: 15 });
        dateLimit = faker.number.int({ min: 7, max: 30 }); // Return period in days
        maxPerRequest = faker.number.int({ min: 1, max: 3 });
      } else if (status === 'Distributed') {
        quantity = faker.number.int({ min: 2, max: 10 });
        maxPerRequest = faker.number.int({ min: 1, max: 2 });
      } else if (status === 'Damaged') {
        quantity = Math.random() < 0.3 ? faker.number.int({ min: 1, max: 3 }) : 0;
      } else if (status === 'Unavailable') {
        quantity = 0;
      }

      await prisma.itemStack.create({
        data: {
          itemId: item.id,
          quantity: quantity,
          status: status,
          date_limit: dateLimit,
          max_quantity_per_request: maxPerRequest
        }
      });
      totalStacks++;
    }
    await wait(50);
  }

  console.log(`✅ Created ${totalStacks} item stacks\n`);
}

//? =============================== DISTRIBUTION QUOTAS =============================== ?//

async function createDistributionQuotas() {
  console.log('🎯 Creating distribution quotas...');
  
  const distributedStacks = await prisma.itemStack.findMany({
    where: { status: 'Distributed', quantity: { gt: 0 } }
  });

  let count = 0;
  for (const stack of distributedStacks) {
    // Random eligibility criteria
    const eligibilityOptions = [
      { livelihood: ["Farming"], barangay: null },
      { livelihood: ["Fishing"], barangay: null },
      { livelihood: ["Farming", "Livestock"], barangay: null },
      { livelihood: null, barangay: ["San Jose", "Poblacion", "San Miguel"] },
      null // No specific criteria
    ];

    const criteria = faker.helpers.arrayElement(eligibilityOptions);

    await prisma.distributionQuota.create({
      data: {
        itemStackId: stack.id,
        maxPerUser: faker.number.int({ min: 1, max: 3 }),
        maxRequestsPerMonth: 1,
        cooldownDays: faker.number.int({ min: 30, max: 90 }),
        eligibilityCriteria: criteria,
        active: true
      }
    });
    count++;
  }

  console.log(`✅ Created ${count} distribution quotas\n`);
}

//? ================================ DISTRIBUTION HISTORY ================================ ?//

async function createDistributionHistory() {
  console.log('📜 Creating distribution history...');
  
  const distributedStacks = await prisma.itemStack.findMany({
    where: { status: 'Distributed', quantity: { gt: 0 } },
    include: { item: true }
  });

  const userAccounts = await prisma.account.findMany({
    where: { access: 'User' }
  });

  let count = 0;
  for (const stack of distributedStacks) {
    // Create 3-8 historical distributions per stack
    const numDistributions = faker.number.int({ min: 3, max: 8 });
    const shuffledUsers = faker.helpers.shuffle(userAccounts);

    for (let i = 0; i < Math.min(numDistributions, shuffledUsers.length); i++) {
      await prisma.distributionHistory.create({
        data: {
          accountId: shuffledUsers[i].id,
          itemStackId: stack.id,
          quantity: faker.number.int({ min: 1, max: stack.max_quantity_per_request || 2 }),
          receivedAt: faker.date.between({
            from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            to: new Date()
          })
        }
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} distribution history records\n`);
}

//? =============================== DISTRIBUTION WAITLIST =============================== ?//

async function createDistributionWaitlist() {
  console.log('⏳ Creating distribution waitlist...');
  
  const distributedStacks = await prisma.itemStack.findMany({
    where: { status: 'Distributed', quantity: { lte: 3 } } // Low stock items
  });

  const userAccounts = await prisma.account.findMany({
    where: { access: 'User' }
  });

  let count = 0;
  for (const stack of distributedStacks.slice(0, 5)) { // Only first 5 low-stock items
    const numWaiting = faker.number.int({ min: 2, max: 6 });
    const shuffledUsers = faker.helpers.shuffle(userAccounts);

    for (let i = 0; i < Math.min(numWaiting, shuffledUsers.length); i++) {
      await prisma.distributionWaitlist.create({
        data: {
          accountId: shuffledUsers[i].id,
          itemStackId: stack.id,
          quantity: 1,
          position: i + 1,
          notified: i === 0, // First in queue was notified
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} waitlist entries\n`);
}

//? ==================================== ITEM TRANSACTIONS ==================================== ?//

async function createItemTransactions() {
  console.log('💳 Creating item transactions (EIC scenarios)...');
  
  const eicStacks = await prisma.itemStack.findMany({
    where: { status: 'EIC', quantity: { gt: 0 } },
    include: { item: true }
  });

  const userAccounts = await prisma.account.findMany({
    where: { access: 'User' }
  });

  const adminAccounts = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } }
  });

  const statuses = [
    'Pending', 'Approved', 'Borrowed', 'Returned', 
    'late_return', 'No_Return', 'Rejected', 'Cancelled',
    'No_Pickup', 'late_pickup'
  ];

  let count = 0;
  
  for (const stack of eicStacks) {
    // Create 4-8 transactions per EIC stack
    const numTransactions = faker.number.int({ min: 4, max: 8 });
    
    for (let i = 0; i < numTransactions; i++) {
      const user = faker.helpers.arrayElement(userAccounts);
      const status = faker.helpers.arrayElement(statuses);
      
      const pickupDate = faker.date.between({
        from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      const returnDate = new Date(pickupDate.getTime() + (stack.date_limit || 14) * 24 * 60 * 60 * 1000);
      
      let adminId = null;
      let actualPickup = null;
      let actualReturn = null;
      let adjustedReturnDate = null;

      // Status-specific logic
      if (['Approved', 'Borrowed', 'Returned', 'late_return', 'No_Return', 'Rejected'].includes(status)) {
        adminId = faker.helpers.arrayElement(adminAccounts).id;
      }

      if (['Borrowed', 'Returned', 'late_return', 'No_Return'].includes(status)) {
        actualPickup = new Date(pickupDate.getTime() + faker.number.int({ min: 0, max: 2 }) * 24 * 60 * 60 * 1000);
      }

      if (status === 'late_pickup') {
        actualPickup = new Date(pickupDate.getTime() + faker.number.int({ min: 3, max: 7 }) * 24 * 60 * 60 * 1000);
        adminId = faker.helpers.arrayElement(adminAccounts).id;
      }

      if (status === 'Returned') {
        actualReturn = new Date(returnDate.getTime() - faker.number.int({ min: 0, max: 2 }) * 24 * 60 * 60 * 1000);
      }

      if (status === 'late_return') {
        actualReturn = new Date(returnDate.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000);
      }

      if (['Borrowed', 'late_return'].includes(status)) {
        // Some items might have adjusted return dates
        if (Math.random() < 0.3) {
          adjustedReturnDate = new Date(returnDate.getTime() + faker.number.int({ min: 7, max: 21 }) * 24 * 60 * 60 * 1000);
        }
      }

      // StatusChangedAt should be after request creation but before/at current time
      let statusChangedAt = null;
      if (adminId && pickupDate < new Date()) {
        statusChangedAt = faker.date.between({ 
          from: pickupDate, 
          to: new Date() 
        });
      } else if (adminId) {
        // For future pickup dates, use a recent date
        statusChangedAt = faker.date.between({
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          to: new Date()
        });
      }

      await prisma.itemTransaction.create({
        data: {
          itemStackId: stack.id,
          accountId: user.id,
          adminId: adminId,
          quantity: faker.number.int({ min: 1, max: stack.max_quantity_per_request || 1 }),
          status: status,
          pickupDate: pickupDate,
          returnDate: returnDate,
          requestNote: Math.random() < 0.5 ? faker.lorem.sentence() : null,
          actual_pickup: actualPickup,
          actual_return: actualReturn,
          adjustedReturnDate: adjustedReturnDate,
          autoStatusChanged: ['late_return', 'late_pickup', 'No_Return', 'No_Pickup'].includes(status) && Math.random() < 0.7,
          statusChangedAt: statusChangedAt,
          statusChangeReason: status === 'Rejected' ? faker.lorem.sentence() : null,
          previousStatus: ['Returned', 'late_return', 'No_Return', 'Cancelled'].includes(status) ? 'Borrowed' : null
        }
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} EIC transactions with all scenarios\n`);
}

//? ================================== PLANTING SEASONS ================================== ?//

async function createPlantingSeasons() {
  console.log('🌾 Creating planting seasons...');
  
  const seasons = [
    {
      name: "Wet Season 2024",
      description: "Main cropping season with regular rainfall",
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-11-30'),
      isActive: false
    },
    {
      name: "Dry Season 2024-2025",
      description: "Off-season cropping with irrigation support",
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-05-31'),
      isActive: true
    },
    {
      name: "Wet Season 2025",
      description: "Main cropping season with regular rainfall",
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-11-30'),
      isActive: false
    }
  ];

  for (const season of seasons) {
    await prisma.plantingSeason.create({ data: season });
  }

  console.log(`✅ Created ${seasons.length} planting seasons\n`);
}

//? ================================== SEED VARIETIES ================================== ?//

async function createSeedVarieties() {
  console.log('🌱 Creating seed varieties...');
  
  const varieties = [
    { name: "NSIC Rc222", cropType: "Rice", directSeededDAS: 95, transplantedDAS: 110, description: "High-yielding inbred rice variety" },
    { name: "NSIC Rc216", cropType: "Rice", directSeededDAS: 100, transplantedDAS: 115, description: "Popular hybrid rice variety" },
    { name: "PSB Rc18", cropType: "Rice", directSeededDAS: 105, transplantedDAS: 120, description: "Aromatic rice variety" },
    { name: "IR64", cropType: "Rice", directSeededDAS: 110, transplantedDAS: 125, description: "Traditional inbred variety" },
    { name: "RC160", cropType: "Rice", directSeededDAS: 100, transplantedDAS: 115, description: "Disease-resistant variety" },
    { name: "Pioneer 30G87", cropType: "Corn", directSeededDAS: 90, transplantedDAS: 90, description: "Yellow hybrid corn" },
    { name: "Dekalb 818", cropType: "Corn", directSeededDAS: 95, transplantedDAS: 95, description: "White hybrid corn" },
    { name: "IPB Var 6", cropType: "Corn", directSeededDAS: 100, transplantedDAS: 100, description: "Open-pollinated corn" },
    { name: "Sweet Corn Hybrid", cropType: "Corn", directSeededDAS: 75, transplantedDAS: 75, description: "Sweet corn variety" },
    { name: "Sinta", cropType: "Corn", directSeededDAS: 95, transplantedDAS: 95, description: "QPM variety" },
    { name: "Roma Tomato", cropType: "High_Value_Crops", directSeededDAS: 70, transplantedDAS: 85, description: "Processing tomato variety" },
    { name: "Cherry Tomato", cropType: "High_Value_Crops", directSeededDAS: 65, transplantedDAS: 80, description: "Small fruited variety" },
    { name: "Chinese Pechay", cropType: "High_Value_Crops", directSeededDAS: 35, transplantedDAS: 40, description: "Fast-growing leafy vegetable" },
    { name: "Lettuce Butterhead", cropType: "High_Value_Crops", directSeededDAS: 45, transplantedDAS: 50, description: "Soft-leaved lettuce" },
    { name: "Bell Pepper", cropType: "High_Value_Crops", directSeededDAS: 80, transplantedDAS: 95, description: "Sweet pepper variety" }
  ];

  for (const variety of varieties) {
    await prisma.seedVariety.create({ data: variety });
  }

  console.log(`✅ Created ${varieties.length} seed varieties\n`);
}

//? ================================== PLANTING REPORTS ================================== ?//

async function createPlantingReports() {
  console.log('📋 Creating planting reports...');
  
  const seasons = await prisma.plantingSeason.findMany();
  const varieties = await prisma.seedVariety.findMany();
  const userAccounts = await prisma.account.findMany({
    where: { access: 'User' }
  });

  const barangays = ["San Jose", "Poblacion", "San Miguel", "Balagtas", "Mataas na Lupa", "Bagong Sikat"];
  const farmerNames = userAccounts.map(acc => `${acc.firstName} ${acc.surname}`);

  let count = 0;
  
  for (const season of seasons) {
    const numReports = faker.number.int({ min: 15, max: 20 });
    
    for (let i = 0; i < numReports; i++) {
      const variety = faker.helpers.arrayElement(varieties.filter(v => season.name.includes('Wet') ? v.cropType === 'Rice' : true));
      
      const plantingDate = faker.date.between({
        from: season.startDate,
        to: new Date(season.startDate.getTime() + 60 * 24 * 60 * 60 * 1000)
      });

      const plantingMethod = faker.helpers.arrayElement(['Direct_Seeded', 'Transplanting']);
      const daysToHarvest = plantingMethod === 'Direct_Seeded' ? variety.directSeededDAS : variety.transplantedDAS;
      const expectedHarvest = new Date(plantingDate.getTime() + daysToHarvest * 24 * 60 * 60 * 1000);

      const areaPlanted = faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 2 });
      const expectedYield = faker.number.int({ min: 2000, max: 8000 });

      // Determine if harvest data should be filled (for completed reports)
      const isHarvested = plantingDate < new Date(Date.now() - daysToHarvest * 24 * 60 * 60 * 1000);

      await prisma.plantingReport.create({
        data: {
          farmerName: faker.helpers.arrayElement(farmerNames),
          farmLocation: `${faker.helpers.arrayElement(barangays)}, ${faker.helpers.arrayElement(['Lipa City', 'Tanauan City', 'Santo Tomas'])}`,
          rsbsaNumber: Math.random() < 0.7 ? `RSBSA-${faker.string.numeric(10)}` : null,
          croppingSeasonId: season.id,
          areaPlanted: areaPlanted,
          seedClassification: faker.helpers.arrayElement(['Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers']),
          typeOfCrop: variety.cropType,
          riceIrrigation: variety.cropType === 'Rice' ? faker.helpers.arrayElement(['Irrigated', 'RainfedLowland']) : null,
          varietyId: variety.id,
          dateOfPlanting: plantingDate,
          plantingMethod: plantingMethod,
          cropInsurance: Math.random() < 0.4,
          harvestArea: isHarvested ? areaPlanted : null,
          numberOfBags: isHarvested ? faker.number.int({ min: 20, max: 100 }) : null,
          weightPerBag: isHarvested ? faker.number.float({ min: 45, max: 55, fractionDigits: 1 }) : null,
          yieldMtPerHa: isHarvested ? faker.number.float({ min: 3.5, max: 7.5, fractionDigits: 2 }) : null,
          dateOfExpectedHarvest: expectedHarvest,
          isArchived: false
        }
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} planting reports\n`);
}

//? ===================================== AUDIT LOGS ===================================== ?//

async function createAuditLogs() {
  console.log('📝 Creating audit logs...');
  
  const adminAccounts = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } }
  });

  const actions = [
    'LOGIN', 'LOGOUT', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE', 'ACCOUNT_ROLE_CHANGE',
    'INVENTORY_CREATE', 'INVENTORY_UPDATE', 'INVENTORY_STATUS_CHANGE',
    'DISTRIBUTION_REQUEST_APPROVE', 'DISTRIBUTION_REQUEST_REJECT',
    'EIC_REQUEST_APPROVE', 'EIC_REQUEST_REJECT', 'EIC_STATUS_CHANGE',
    'SEMINAR_CREATE', 'SEMINAR_UPDATE', 'SEMINAR_STATUS_CHANGE',
    'SETTINGS_UPDATE', 'INQUIRY_CREATE', 'INQUIRY_ASSIGN', 'INQUIRY_RESOLVE',
    'SURVEY_FORM_CREATE', 'SURVEY_FORM_UPDATE', 'SURVEY_RESPONSE_SUBMIT',
    'REGISTERED_CROP_CREATE', 'CROP_REPORT_SUBMIT', 'PROFILE_UPDATE'
  ];

  const ipAddresses = ['192.168.1.10', '192.168.1.15', '10.0.0.5', '172.16.0.20'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36'
  ];

  let count = 0;
  const numLogs = 100; // Create 100 audit logs

  for (let i = 0; i < numLogs; i++) {
    const admin = faker.helpers.arrayElement(adminAccounts);
    const action = faker.helpers.arrayElement(actions);
    
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: action,
        targetType: action.includes('ACCOUNT') ? 'Account' : action.includes('INVENTORY') ? 'InventoryItem' : action.includes('SEMINAR') ? 'Seminar' : null,
        targetId: faker.string.uuid(),
        targetName: faker.lorem.words(2),
        details: faker.lorem.sentence(),
        metadata: JSON.stringify({ key: "value", timestamp: new Date().toISOString() }),
        ipAddress: faker.helpers.arrayElement(ipAddresses),
        userAgent: faker.helpers.arrayElement(userAgents),
        createdAt: faker.date.between({
          from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          to: new Date()
        })
      }
    });
    count++;
  }

  console.log(`✅ Created ${count} audit logs\n`);
}

//? ================================== NOTIFICATIONS ================================== ?//

async function createNotifications() {
  console.log('🔔 Creating notifications...');
  
  const userAccounts = await prisma.account.findMany({
    where: { access: 'User' }
  });

  const types = ['REQUEST_APPROVED', 'REQUEST_REJECTED', 'ITEM_DUE_SOON', 'ITEM_OVERDUE', 'SEMINAR_REMINDER', 'SYSTEM_ALERT'];
  
  let count = 0;
  
  for (const user of userAccounts) {
    const numNotifications = faker.number.int({ min: 5, max: 12 });
    
    for (let i = 0; i < numNotifications; i++) {
      const type = faker.helpers.arrayElement(types);
      let title = '';
      let message = '';

      switch (type) {
        case 'REQUEST_APPROVED':
          title = 'Request Approved';
          message = 'Your equipment request has been approved. Please pick up at the office.';
          break;
        case 'REQUEST_REJECTED':
          title = 'Request Rejected';
          message = 'Your equipment request was rejected. Please contact admin for details.';
          break;
        case 'ITEM_DUE_SOON':
          title = 'Return Reminder';
          message = 'Your borrowed item is due for return in 3 days.';
          break;
        case 'ITEM_OVERDUE':
          title = 'Overdue Item';
          message = 'You have an overdue item. Please return it immediately.';
          break;
        case 'SEMINAR_REMINDER':
          title = 'Seminar Reminder';
          message = 'Your registered seminar is tomorrow. Please be on time.';
          break;
        case 'SYSTEM_ALERT':
          title = 'System Update';
          message = 'The system will undergo maintenance this weekend.';
          break;
      }

      await prisma.notification.create({
        data: {
          accountId: user.id,
          type: type,
          title: title,
          message: message,
          relatedId: faker.string.uuid(),
          read: Math.random() < 0.6, // 60% read rate
          createdAt: faker.date.between({
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            to: new Date()
          })
        }
      });
      count++;
    }

    // Create notification settings for user
    await prisma.notificationSettings.upsert({
      where: { accountId: user.id },
      update: {},
      create: {
        accountId: user.id,
        emailEnabled: true,
        requestApproved: true,
        requestRejected: true,
        itemDueSoon: true,
        itemOverdue: true,
        seminarReminder: true
      }
    });
  }

  console.log(`✅ Created ${count} notifications\n`);
}

//? ===================================== USER PREFERENCES ===================================== ?//

async function createUserPreferences() {
  console.log('⚙️ Creating user preferences...');
  
  const accounts = await prisma.account.findMany();
  
  const defaultPreferences = [
    { key: 'theme', getValue: () => faker.helpers.arrayElement(['light', 'dark', 'auto']) },
    { key: 'language', getValue: () => faker.helpers.arrayElement(['en', 'tl']) },
    { key: 'notifications_enabled', getValue: () => String(Math.random() < 0.85) },
    { key: 'email_notifications', getValue: () => String(Math.random() < 0.75) }
  ];

  let count = 0;
  
  for (const account of accounts) {
    for (const pref of defaultPreferences) {
      await prisma.userPreference.create({
        data: {
          userId: account.id,
          key: pref.key,
          value: pref.getValue()
        }
      });
      count++;
    }
  }

  console.log(`✅ Created ${count} user preferences\n`);
}

//? ===================================== MAIN EXECUTION ===================================== ?//

async function main() {
  try {
    console.log('🗑️  Clearing existing data...\n');
    
    // Clear in correct order due to foreign key constraints
    // Start with child tables first
    await prisma.userPreference.deleteMany();
    await prisma.notificationSettings.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    
    // Planting reports
    await prisma.plantingReport.deleteMany();
    await prisma.seedVariety.deleteMany();
    await prisma.plantingSeason.deleteMany();
    
    // Survey system
    await prisma.surveyAnswer.deleteMany();
    await prisma.surveyResponse.deleteMany();
    await prisma.surveyStatistic.deleteMany();
    await prisma.surveyField.deleteMany();
    await prisma.surveyForm.deleteMany();
    
    // Inquiry system
    await prisma.inquiryAttachment.deleteMany();
    await prisma.inquiryReply.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.fAQ.deleteMany();
    await prisma.fAQCategory.deleteMany();
    
    // Chat system
    await prisma.chatReadReceipt.deleteMany();
    await prisma.chatAttachment.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatParticipant.deleteMany();
    await prisma.chatRoom.deleteMany();
    
    // Inventory and distribution
    await prisma.itemTransaction.deleteMany();
    await prisma.distributionWaitlist.deleteMany();
    await prisma.distributionHistory.deleteMany();
    await prisma.distributionQuota.deleteMany();
    await prisma.itemStack.deleteMany();
    await prisma.inventoryItem.deleteMany();
    
    // Seminars
    await prisma.seminarParticipant.deleteMany();
    await prisma.seminar.deleteMany();
    
    // Finally, accounts
    await prisma.account.deleteMany();

    console.log('✅ Database cleared\n');
    console.log('=' .repeat(50));
    console.log('STARTING COMPREHENSIVE SEED');
    console.log('=' .repeat(50) + '\n');

    await createAccounts();
    await createSeminars();
    await createSeminarParticipants();
    await createInventoryItems();
    await createItemStacks();
    await createDistributionQuotas();
    await createDistributionHistory();
    await createDistributionWaitlist();
    await createItemTransactions();
    await createPlantingSeasons();
    await createSeedVarieties();
    await createPlantingReports();
    await createAuditLogs();
    await createNotifications();
    await createUserPreferences();

    console.log('=' .repeat(50));
    console.log('✅ COMPREHENSIVE SEED COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(50) + '\n');

    // Print summary
    console.log('📊 DATABASE SUMMARY:');
    console.log(`   Accounts: ${await prisma.account.count()}`);
    console.log(`   Seminars: ${await prisma.seminar.count()}`);
    console.log(`   Seminar Participants: ${await prisma.seminarParticipant.count()}`);
    console.log(`   Inventory Items: ${await prisma.inventoryItem.count()}`);
    console.log(`   Item Stacks: ${await prisma.itemStack.count()}`);
    console.log(`   Item Transactions: ${await prisma.itemTransaction.count()}`);
    console.log(`   Distribution Quotas: ${await prisma.distributionQuota.count()}`);
    console.log(`   Distribution History: ${await prisma.distributionHistory.count()}`);
    console.log(`   Distribution Waitlist: ${await prisma.distributionWaitlist.count()}`);
    console.log(`   Planting Seasons: ${await prisma.plantingSeason.count()}`);
    console.log(`   Seed Varieties: ${await prisma.seedVariety.count()}`);
    console.log(`   Planting Reports: ${await prisma.plantingReport.count()}`);
    console.log(`   Audit Logs: ${await prisma.auditLog.count()}`);
    console.log(`   Notifications: ${await prisma.notification.count()}`);
    console.log(`   User Preferences: ${await prisma.userPreference.count()}`);
    console.log('\n✨ All tables have been populated with comprehensive data!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
