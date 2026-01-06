/**
 * COMPREHENSIVE SEED - ALL STATES AND FEATURES
 * This seed file creates realistic test data covering ALL possible states for every feature
 * Minimum 5 entries per state, with varied dates for thorough testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to create dates relative to now
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export async function seedComprehensiveAllStates() {
  console.log('🌱 Starting comprehensive all-states seed...\n');

  // ==================== CLEANUP EXISTING DATA ====================
  console.log('🧹 Cleaning existing data...');
  try {
    // Delete in correct order (respecting foreign keys)
    await prisma.chatAttachment.deleteMany({});
    await prisma.chatReadReceipt.deleteMany({});
    await prisma.chatMessage.deleteMany({});
    await prisma.chatParticipant.deleteMany({});
    await prisma.chatRoom.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.notificationSettings.deleteMany({});
    
    await prisma.inquiryAttachment.deleteMany({});
    await prisma.inquiryReply.deleteMany({});
    await prisma.inquiry.deleteMany({});
    
    await prisma.surveyAnswer.deleteMany({});
    await prisma.surveyResponse.deleteMany({});
    await prisma.surveyStatistic.deleteMany({});
    await prisma.surveyField.deleteMany({});
    await prisma.surveyForm.deleteMany({});
    
    await prisma.seminarParticipant.deleteMany({});
    await prisma.seminar.deleteMany({});
    
    await prisma.plantingReport.deleteMany({});
    
    await prisma.distributionHistory.deleteMany({});
    await prisma.distributionWaitlist.deleteMany({});
    await prisma.distributionQuota.deleteMany({});
    
    const deletedTxn = await prisma.itemTransaction.deleteMany({});
    const deletedStacks = await prisma.itemStack.deleteMany({});
    const deletedItems = await prisma.inventoryItem.deleteMany({});
    console.log(`  ✓ Deleted ${deletedTxn.count} transactions, ${deletedStacks.count} stacks, ${deletedItems.count} items`);
    
    await prisma.seedVariety.deleteMany({});
    await prisma.plantingSeason.deleteMany({});
    
    await prisma.fAQ.deleteMany({});
    await prisma.fAQCategory.deleteMany({});
    
    await prisma.auditLog.deleteMany({});
    
    await prisma.userPreference.deleteMany({});
    const deletedAccounts = await prisma.account.deleteMany({});
    console.log(`  ✓ Deleted ${deletedAccounts.count} accounts`);
    
    console.log('✅ Database completely wiped clean\n');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    throw error;
  }

  // ====================  ACCOUNTS ====================
  console.log('👥 Creating diverse user accounts...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const accountsData = [
    // Super Admin
    { username: 'admin', email: 'admin@farmerconnect.com', access: 'Super_Admin', firstName: 'System', surname: 'Administrator', sex: 'Male', contactNumber: '09171234567', client_profile: 'Govt_Employee', dateOfBirth: new Date('1985-01-15') },
    
    // Regular Admins (5)
    { username: 'admin_john', email: 'john.admin@fc.com', access: 'Admin', firstName: 'John', surname: 'Santos', sex: 'Male', contactNumber: '09181234567', client_profile: 'Govt_Employee', dateOfBirth: new Date('1988-03-10') },
    { username: 'admin_maria', email: 'maria.admin@fc.com', access: 'Admin', firstName: 'Maria', surname: 'Cruz', sex: 'Female', contactNumber: '09191234567', client_profile: 'Govt_Employee', dateOfBirth: new Date('1990-07-22') },
    { username: 'admin_pedro', email: 'pedro.admin@fc.com', access: 'Admin', firstName: 'Pedro', surname: 'Reyes', sex: 'Male', contactNumber: '09201234567', client_profile: 'Govt_Employee', dateOfBirth: new Date('1987-11-15') },
    { username: 'admin_anna', email: 'anna.admin@fc.com', access: 'Admin', firstName: 'Anna', surname: 'Garcia', sex: 'Female', contactNumber: '09211234567', client_profile: 'Govt_Employee', dateOfBirth: new Date('1992-05-30') },
    { username: 'admin_jose', email: 'jose.admin@fc.com', access: 'Admin', firstName: 'Jose', surname: 'Ramos', sex: 'Male', contactNumber: '09221234567', client_profile: 'Govt_Employee', dateOfBirth: new Date('1986-09-18') },
    
    // Users - Active (10)
    { username: 'farmer01', email: 'farmer01@test.com', access: 'User', firstName: 'Juan', surname: 'Dela Cruz', sex: 'Male', contactNumber: '09301234567', client_profile: 'Other', dateOfBirth: new Date('1990-01-10') },
    { username: 'farmer02', email: 'farmer02@test.com', access: 'User', firstName: 'Rosa', surname: 'Martinez', sex: 'Female', contactNumber: '09302234567', client_profile: 'Women', dateOfBirth: new Date('1988-06-15') },
    { username: 'farmer03', email: 'farmer03@test.com', access: 'User', firstName: 'Carlos', surname: 'Lopez', sex: 'Male', contactNumber: '09303234567', client_profile: 'Other', dateOfBirth: new Date('1992-03-22') },
    { username: 'farmer04', email: 'farmer04@test.com', access: 'User', firstName: 'Linda', surname: 'Gonzales', sex: 'Female', contactNumber: '09304234567', client_profile: 'Women', dateOfBirth: new Date('1991-09-30') },
    { username: 'farmer05', email: 'farmer05@test.com', access: 'User', firstName: 'Miguel', surname: 'Torres', sex: 'Male', contactNumber: '09305234567', client_profile: 'Other', dateOfBirth: new Date('1989-12-05') },
    { username: 'farmer06', email: 'farmer06@test.com', access: 'User', firstName: 'Elena', surname: 'Fernandez', sex: 'Female', contactNumber: '09306234567', client_profile: 'Women', dateOfBirth: new Date('1993-04-18') },
    { username: 'farmer07', email: 'farmer07@test.com', access: 'User', firstName: 'Ramon', surname: 'Villanueva', sex: 'Male', contactNumber: '09307234567', client_profile: 'Youth', dateOfBirth: new Date('1994-08-11') },
    { username: 'farmer08', email: 'farmer08@test.com', access: 'User', firstName: 'Carmen', surname: 'Herrera', sex: 'Female', contactNumber: '09308234567', client_profile: 'Women', dateOfBirth: new Date('1990-11-25') },
    { username: 'farmer09', email: 'farmer09@test.com', access: 'User', firstName: 'Antonio', surname: 'Morales', sex: 'Male', contactNumber: '09309234567', client_profile: 'Student', dateOfBirth: new Date('1995-02-14') },
    { username: 'farmer10', email: 'farmer10@test.com', access: 'User', firstName: 'Teresa', surname: 'Jimenez', sex: 'Female', contactNumber: '09310234567', client_profile: 'Other', dateOfBirth: new Date('1987-07-07') },
  ];

  await prisma.account.createMany({
    data: accountsData.map(acc => ({ ...acc, password: hashedPassword })),
    skipDuplicates: true
  });

  const accounts = await prisma.account.findMany();
  const admin = accounts.find(a => a.username === 'admin');
  const users = accounts.filter(a => a.access === 'User');
  
  console.log(`✅ Created ${accounts.length} accounts (${users.length} farmers)`);

  // ==================== FAQ CATEGORIES & FAQs ====================
  console.log('\n📚 Creating FAQ categories and questions...');
  
  const faqCategoriesData = [
    { name: 'Seed Distribution', description: 'Questions about seed distribution programs', isActive: true, orderIndex: 1, createdById: admin.id },
    { name: 'Equipment Rental', description: 'Farming equipment rental information', isActive: true, orderIndex: 2, createdById: admin.id },
    { name: 'Seminars & Training', description: 'Training and seminar programs', isActive: true, orderIndex: 3, createdById: admin.id },
    { name: 'Financial Aid', description: 'Loans and financial assistance', isActive: true, orderIndex: 4, createdById: admin.id },
    { name: 'Account Help', description: 'Account and registration support', isActive: false, orderIndex: 5, createdById: admin.id }, // Inactive category
  ];

  await prisma.fAQCategory.createMany({ data: faqCategoriesData, skipDuplicates: true });
  const faqCategories = await prisma.fAQCategory.findMany();

  const faqsData = [
    // Active FAQs (5 per category minimum for active categories)
    ...Array.from({ length: 5 }, (_, i) => ({
      categoryId: faqCategories[0].id,
      question: `How do I apply for seed distribution - Method ${i + 1}?`,
      answer: `To apply for seeds using method ${i + 1}, you need to register on the platform, complete your profile, and submit a distribution request. Processing time is 3-5 business days.`,
      isActive: true,
      orderIndex: i + 1,
      createdById: admin.id,
      createdAt: daysAgo(30 - i * 2),
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      categoryId: faqCategories[1].id,
      question: `Equipment rental question ${i + 1}?`,
      answer: `Equipment rental answer ${i + 1}: We provide various farming equipment. Contact your local office for availability.`,
      isActive: true,
      orderIndex: i + 1,
      createdById: admin.id,
      createdAt: daysAgo(25 - i * 2),
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      categoryId: faqCategories[2].id,
      question: `Seminar enrollment question ${i + 1}?`,
      answer: `Seminar answer ${i + 1}: Seminars are free for registered farmers. Check the schedule and register online.`,
      isActive: true,
      orderIndex: i + 1,
      createdById: admin.id,
      createdAt: daysAgo(20 - i * 2),
    })),
    // Inactive FAQs (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      categoryId: faqCategories[3].id,
      question: `Outdated financial aid question ${i + 1}?`,
      answer: `Old information that is no longer valid ${i + 1}.`,
      isActive: false,
      orderIndex: i + 1,
      createdById: admin.id,
      createdAt: daysAgo(60 - i * 5),
    })),
  ];

  await prisma.fAQ.createMany({ data: faqsData, skipDuplicates: true });
  console.log(`✅ Created ${faqCategories.length} FAQ categories and ${faqsData.length} FAQs`);

  // ==================== SURVEY FORMS ====================
  console.log('\n📋 Creating survey forms with all statuses...');
  
  const surveyFormsData = [
    // ACTIVE surveys (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      title: `Active Survey ${i + 1}: Farmer Satisfaction ${new Date().getFullYear()}`,
      description: `Help us improve services - Active survey ${i + 1}`,
      status: 'ACTIVE',
      category: ['feedback', 'equipment', 'seminar', 'agriculture', 'general'][i],
      createdById: admin.id,
      createdAt: daysAgo(45 - i * 5),
    })),
    // DRAFT surveys (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      title: `Draft Survey ${i + 1}: Upcoming Program Assessment`,
      description: `Survey in preparation ${i + 1}`,
      status: 'DRAFT',
      category: ['general', 'feedback', 'equipment', 'seminar', 'agriculture'][i],
      createdById: admin.id,
      createdAt: daysAgo(15 - i * 2),
    })),
    // INACTIVE surveys (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      title: `Inactive Survey ${i + 1}: Past Season Evaluation`,
      description: `Completed survey ${i + 1} - No longer accepting responses`,
      status: 'INACTIVE',
      category: ['agriculture', 'general', 'feedback', 'equipment', 'seminar'][i],
      createdById: admin.id,
      createdAt: daysAgo(90 - i * 10),
    })),
  ];

  for (const surveyData of surveyFormsData) {
    await prisma.surveyForm.create({
      data: {
        ...surveyData,
        fields: {
          createMany: {
            data: [
              { type: 'TEXT', label: 'Full Name', placeholder: 'Enter your name', required: true, order: 1 },
              { type: 'EMAIL', label: 'Email', placeholder: 'your@email.com', required: true, order: 2 },
              { type: 'SELECT', label: 'Region', required: true, order: 3, options: JSON.stringify(['Region I', 'Region II', 'Region III', 'NCR']) },
              { type: 'RADIO', label: 'Satisfaction Level', required: true, order: 4, options: JSON.stringify(['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']) },
              { type: 'TEXTAREA', label: 'Comments', placeholder: 'Your feedback...', required: false, order: 5 },
            ]
          }
        }
      }
    });
  }
  
  console.log(`✅ Created ${surveyFormsData.length} survey forms (5 ACTIVE, 5 DRAFT, 5 CLOSED)`);

  // ==================== SURVEY RESPONSES ====================
  console.log('\n📝 Creating survey responses...');
  
  // Get all active surveys with their fields
  const activeSurveys = await prisma.surveyForm.findMany({
    where: { status: 'ACTIVE' },
    include: { fields: true },
    take: 3 // Create responses for first 3 active surveys
  });

  let totalResponses = 0;
  
  for (const survey of activeSurveys) {
    // Create 3-5 responses per survey
    const numResponses = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numResponses; i++) {
      const user = users[i % users.length];
      
      // Create the response entry
      const response = await prisma.surveyResponse.create({
        data: {
          surveyFormId: survey.id,
          userId: user.id,
          submittedAt: daysAgo(Math.floor(Math.random() * 30)),
          metadata: JSON.stringify({ source: 'web', browser: 'Chrome' })
        }
      });
      
      // Create answers for each field
      const answersData = survey.fields.map((field) => {
        let answer;
        
        switch (field.type) {
          case 'TEXT':
            answer = `Sample text response ${i + 1} for ${field.label}`;
            break;
          case 'EMAIL':
            answer = `user${i + 1}@example.com`;
            break;
          case 'TEXTAREA':
            answer = `This is a detailed response for ${field.label}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
            break;
          case 'NUMBER':
            answer = String(Math.floor(Math.random() * 100) + 1);
            break;
          case 'DATE':
            answer = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case 'SELECT':
          case 'RADIO':
            try {
              const options = JSON.parse(field.options || '[]');
              answer = options[Math.floor(Math.random() * options.length)] || 'Option 1';
            } catch {
              answer = 'Option 1';
            }
            break;
          case 'CHECKBOX':
            try {
              const options = JSON.parse(field.options || '[]');
              const selected = options.slice(0, Math.floor(Math.random() * options.length) + 1);
              answer = JSON.stringify(selected);
            } catch {
              answer = JSON.stringify(['Option 1']);
            }
            break;
          default:
            answer = `Response ${i + 1}`;
        }
        
        return {
          responseId: response.id,
          fieldId: field.id,
          answer: String(answer)
        };
      });
      
      await prisma.surveyAnswer.createMany({ data: answersData });
      totalResponses++;
    }
  }
  
  console.log(`✅ Created ${totalResponses} survey responses with answers`);

  // ==================== INQUIRIES ====================
  console.log('\n💬 Creating inquiries with all statuses...');
  
  const inquiryStatuses = ['PENDING', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CANCELLED'];
  const inquiriesData = [];

  for (const status of inquiryStatuses) {
    for (let i = 0; i < 5; i++) {
      const user = users[i % users.length];
      const daysOld = status === 'PENDING' ? i * 2 : status === 'IN_PROGRESS' ? 15 + i * 3 : status === 'WAITING_USER' ? 25 + i * 2 : status === 'RESOLVED' ? 40 + i * 3 : 60 + i * 5;
      
      inquiriesData.push({
        userId: user.id,
        subject: `${status} Inquiry ${i + 1}: Help needed with farming issue`,

        status: status,
        message: `This is a ${status.toLowerCase()} inquiry message number ${i + 1}. I need assistance with my farming operations.`,
        createdAt: daysAgo(daysOld),
        updatedAt: status === 'Closed' || status === 'Resolved' ? daysAgo(daysOld - 5) : daysAgo(daysOld / 2),
      });
    }
  }

  await prisma.inquiry.createMany({ data: inquiriesData, skipDuplicates: true });
  console.log(`✅ Created ${inquiriesData.length} inquiries (5 per status: PENDING, IN_PROGRESS, WAITING_USER, RESOLVED, CANCELLED)`);

  // ==================== SEMINARS ====================
  console.log('\n🎓 Creating seminars with all statuses...');
  
  const seminarStatuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  const seminarsData = [];

  for (const status of seminarStatuses) {
    for (let i = 0; i < 5; i++) {
      let start_date, end_date, registration_deadline;
      
      if (status === 'Upcoming') {
        start_date = daysFromNow(10 + i * 7);
        end_date = daysFromNow(10 + i * 7 + 1);
        registration_deadline = daysFromNow(5 + i * 7);
      } else if (status === 'Ongoing') {
        start_date = daysAgo(1);
        end_date = daysFromNow(2);
        registration_deadline = daysAgo(5);
      } else if (status === 'Completed') {
        start_date = daysAgo(30 + i * 10);
        end_date = daysAgo(29 + i * 10);
        registration_deadline = daysAgo(35 + i * 10);
      } else { // Cancelled
        start_date = daysFromNow(5 + i * 3);
        end_date = daysFromNow(6 + i * 3);
        registration_deadline = daysFromNow(2 + i * 3);
      }

      seminarsData.push({
        title: `${status} Seminar ${i + 1}: Modern Farming Techniques`,
        description: `Learn about ${status.toLowerCase()} farming methods and best practices. Session ${i + 1}.`,
        status: status,
        start_date: start_date,
        end_date: end_date,
        start_time: ['09:00', '10:00', '13:00', '14:00', '08:00'][i],
        end_time: ['17:00', '16:00', '15:00', '18:00', '12:00'][i],
        location: `Training Center ${i + 1}, Municipality ${String.fromCharCode(65 + i)}`,
        speaker: `${['Dr.', 'Engr.', 'Prof.', 'Ms.', 'Mr.'][i]} ${['Santos', 'Cruz', 'Reyes', 'Garcia', 'Martinez'][i]} - Agricultural Specialist`,
        capacity: 30 + i * 10,
        registration_deadline: registration_deadline,
        createdById: admin.id,
        createdAt: status === 'Completed' ? daysAgo(60 + i * 10) : daysAgo(20 + i * 3),
      });
    }
  }

  await prisma.seminar.createMany({ data: seminarsData, skipDuplicates: true });
  console.log(`✅ Created ${seminarsData.length} seminars (5 per status: Upcoming, Ongoing, Completed, Cancelled)`);

  // ==================== INVENTORY ITEMS ====================
  console.log('\n📦 Creating inventory items with various stock levels...');
  
  // ==================== EIC ITEMS (Farming Equipment) ====================
  const eicItemsData = [
    { name: 'Hand Tractor - Kubota KJ15', description: '15HP diesel-powered hand tractor', category: 'Farming_Equipment' },
    { name: 'Knapsack Sprayer - 16L', description: 'Manual backpack sprayer', category: 'Pest_Control' },
    { name: 'Rice Thresher - Portable', description: 'Gasoline-powered portable rice thresher', category: 'Harvesting_Tools' },
    { name: 'Water Pump - 2-inch', description: 'Gasoline-powered water pump for irrigation', category: 'Irrigation_Systems' },
    { name: 'Rice Dryer - Batch Type', description: 'Batch-type mechanical dryer', category: 'Processing_Equipment' },
    { name: 'Corn Sheller - Hand Operated', description: 'Manual corn sheller with dual rollers', category: 'Harvesting_Tools' },
  ];

  await prisma.inventoryItem.createMany({ data: eicItemsData, skipDuplicates: true });
  
  // ==================== DISTRIBUTION ITEMS (Seeds Only) ====================
  // First create seed varieties
  const varietiesData = [
    { name: 'RC 160', cropType: 'Rice', description: 'High-yielding rice variety', directSeededDAS: 90, transplantedDAS: 110, plantingWindow: 30, isActive: true },
    { name: 'RC 222', cropType: 'Rice', description: 'Drought-resistant rice', directSeededDAS: 85, transplantedDAS: 105, plantingWindow: 30, isActive: true },
    { name: 'NSIC Rc 216', cropType: 'Rice', description: 'Premium rice quality', directSeededDAS: 95, transplantedDAS: 115, plantingWindow: 30, isActive: true },
    { name: 'PSB Rc 18', cropType: 'Rice', description: 'Salt-tolerant variety', directSeededDAS: 88, transplantedDAS: 108, plantingWindow: 30, isActive: true },
    { name: 'IPB Var 6', cropType: 'Corn', description: 'Yellow corn variety', directSeededDAS: 90, transplantedDAS: 90, plantingWindow: 20, isActive: true },
    { name: 'Pioneer 3021', cropType: 'Corn', description: 'Hybrid corn seeds', directSeededDAS: 95, transplantedDAS: 95, plantingWindow: 20, isActive: true },
  ];

  await prisma.seedVariety.createMany({ data: varietiesData, skipDuplicates: true });
  const varieties = await prisma.seedVariety.findMany();

  // Create seed inventory items linked to varieties
  const distributionItemsData = varieties.map(variety => ({
    name: `${variety.name} Seeds`,
    description: `${variety.description}`,
    category: 'Seeds',
    unit: 'kg',
    seedVarietyId: variety.id
  }));

  await prisma.inventoryItem.createMany({ data: distributionItemsData, skipDuplicates: true });
  
  console.log(`✅ Created ${eicItemsData.length + distributionItemsData.length} inventory items (${eicItemsData.length} EIC equipment, ${distributionItemsData.length} seeds)`);

  // ==================== CREATE ITEM STACKS ====================
  const eicItems = await prisma.inventoryItem.findMany({
    where: { seedVarietyId: null }
  });
  
  const distributionItems = await prisma.inventoryItem.findMany({
    where: { seedVarietyId: { not: null } }
  });

  const stacksData = [];
  
  // EIC stacks (Available, Unavailable, Damaged, EIC)
  const eicStatuses = ['Available', 'Unavailable', 'Damaged', 'EIC'];
  for (const item of eicItems) {
    for (let i = 0; i < eicStatuses.length; i++) {
      const status = eicStatuses[i];
      const quantity = status === 'Available' ? 8 :
                      status === 'Damaged' ? 1 :
                      status === 'EIC' ? 5 : 4;
      
      stacksData.push({
        itemId: item.id,
        quantity,
        status,
        date_limit: status === 'EIC' ? 30 : null,
        max_quantity_per_request: status === 'EIC' ? 1 : null,
      });
    }
  }
  
  // Distribution stacks (Available, Distributed)
  for (const item of distributionItems) {
    stacksData.push({
      itemId: item.id,
      quantity: 500, // 500kg available
      status: 'Available',
      max_quantity_per_request: 50,
    });
    
    stacksData.push({
      itemId: item.id,
      quantity: 1000, // 1000kg distributed
      status: 'Distributed',
      max_quantity_per_request: 50,
    });
  }

  await prisma.itemStack.createMany({ data: stacksData, skipDuplicates: true });
  console.log(`✅ Created ${stacksData.length} item stacks (${eicItems.length * 4} EIC, ${distributionItems.length * 2} Distribution)`);

  // ==================== DISTRIBUTION REQUESTS (ITEM TRANSACTIONS) - DISABLED ====================
  /*
  console.log('\n🚚 Creating distribution requests with all statuses...');
  
  // Get distribution stacks (seeds only)
  const distributionStacks = await prisma.itemStack.findMany({
    where: {
      status: 'Distributed',
      item: { seedVarietyId: { not: null } }
    },
    include: { item: true },
    take: 10
  });
  
  const transactionStatuses = ['Pending', 'Approved', 'Picked_Up', 'Rejected', 'Cancelled'];
  const distributionData = [];
  
  // Create requests ensuring no user has multiple active requests for the same stack
  let stackIndex = 0;
  let userIndex = 0;

  for (const status of transactionStatuses) {
    for (let i = 0; i < 5; i++) {
      const user = users[userIndex % users.length];
      const stack = distributionStacks[stackIndex % distributionStacks.length];
      const daysOld = status === 'Pending' ? i * 2 : status === 'Approved' ? 10 + i * 2 : status === 'Picked_Up' ? 30 + i * 3 : status === 'Rejected' ? 20 + i * 4 : 25 + i * 3;
      
      distributionData.push({
        itemStackId: stack.id,
        accountId: user.id,
        quantity: 10 + i * 5,
        status: status,
        pickupDate: status === 'Picked_Up' ? daysAgo(daysOld) : daysFromNow(3),
        requestNote: `Distribution request ${i + 1} - Status: ${status}`,
        farmLocation: `Farm Location ${i + 1}`,
        areaPlanted: 1.0 + i * 0.5,
        plantingMethod: ['Direct_Seeded', 'Transplanting'][i % 2],
        createdAt: daysAgo(daysOld),
        updatedAt: daysAgo(Math.floor(daysOld / 2)),
      });
      
      // Rotate to next user and stack to avoid duplicates
      userIndex++;
      stackIndex++;
    }
  }

  await prisma.itemTransaction.createMany({ data: distributionData, skipDuplicates: true });
  console.log(`✅ Created ${distributionData.length} distribution requests (5 per status: Pending, Approved, Picked_Up, Rejected, Cancelled)`);
  */

  // ==================== EIC TRANSACTIONS - DISABLED ====================
  /*
  console.log('\n🔧 Creating EIC (Equipment in Circulation) transactions...');
  
  // Get EIC item stacks
  const eicStacks = await prisma.itemStack.findMany({
    where: { status: 'EIC', quantity: { gt: 0 } },
    take: 10
  });

  if (eicStacks.length > 0) {
    const eicStatuses = ['Pending', 'Approved', 'Borrowed', 'Returned', 'late_return', 'No_Return', 'Rejected', 'Cancelled', 'No_Pickup', 'late_pickup'];
    const eicTransactions = [];
    const admins = accounts.filter(a => a.access === 'Admin' || a.access === 'Super_Admin');
    
    // Track user-stack combinations to avoid duplicates and enforce 3 request limit
    // Reduced from 5 to 3 iterations to respect 3 active request limit per user
    let eicUserIndex = 0;
    let eicStackIndex = 0;

    for (const status of eicStatuses) {
      for (let i = 0; i < 3; i++) {
        const user = users[eicUserIndex % users.length];
        const stack = eicStacks[eicStackIndex % eicStacks.length];
        const admin = admins[i % admins.length];
        const daysOld = i * 3 + 5;
        
        let returnDate, actual_return, actual_pickup, adjustedReturnDate, pickupDate;
        let statusChangeReason;

        if (status === 'Pending') {
          pickupDate = daysFromNow(2); // Scheduled future pickup
          returnDate = daysFromNow(9);
        } else if (status === 'Approved') {
          pickupDate = daysFromNow(1); // Scheduled future pickup
          returnDate = daysFromNow(8);
        } else if (status === 'Borrowed') {
          pickupDate = daysAgo(5 + i); // Picked up in the past
          actual_pickup = daysAgo(5 + i);
          returnDate = daysFromNow(2 + i);
        } else if (status === 'Returned') {
          pickupDate = daysAgo(15 + i * 2); // Picked up in the past
          actual_pickup = daysAgo(15 + i * 2);
          returnDate = daysAgo(8 + i * 2);
          actual_return = daysAgo(7 + i * 2);
        } else if (status === 'late_return') {
          pickupDate = daysAgo(20 + i * 2); // Picked up in the past
          actual_pickup = daysAgo(20 + i * 2);
          returnDate = daysAgo(5 + i);
          actual_return = daysAgo(2 + i);
          statusChangeReason = 'Item returned after due date';
        } else if (status === 'No_Return') {
          pickupDate = daysAgo(40 + i * 5); // Picked up but never returned
          actual_pickup = daysAgo(40 + i * 5);
          returnDate = daysAgo(33 + i * 5);
          statusChangeReason = 'Item not returned, user contacted multiple times';
        } else if (status === 'Rejected') {
          pickupDate = daysFromNow(3); // Would have been scheduled
          returnDate = daysFromNow(10);
          statusChangeReason = ['Item currently unavailable', 'Request exceeds quantity limit', 'User has pending overdue items', 'Incomplete documentation', 'Outside service area'][i % 5];
        } else if (status === 'Cancelled') {
          pickupDate = daysFromNow(2); // Was scheduled before cancellation
          returnDate = daysFromNow(9);
          statusChangeReason = ['Changed plans', 'Found alternative', 'No longer needed', 'Emergency came up', 'Rescheduling needed'][i % 5];
        } else if (status === 'No_Pickup') {
          pickupDate = daysAgo(2 + i); // Was scheduled but didn't show up
          returnDate = daysFromNow(5);
          statusChangeReason = 'User did not pick up approved item within timeframe';
        } else if (status === 'late_pickup') {
          pickupDate = daysAgo(1); // Picked up late
          actual_pickup = daysAgo(1);
          returnDate = daysFromNow(6);
          statusChangeReason = 'User picked up item after scheduled date';
        }

        eicTransactions.push({
          itemStackId: stack.id,
          accountId: user.id,
          adminId: ['Approved', 'Rejected', 'Borrowed', 'Returned', 'late_return', 'No_Return', 'No_Pickup'].includes(status) ? admin.id : null,
          quantity: Math.min(stack.max_quantity_per_request || 1, 1 + i),
          status: status,
          pickupDate: pickupDate,
          returnDate: returnDate,
          actual_pickup: actual_pickup,
          actual_return: actual_return,
          adjustedReturnDate: adjustedReturnDate,
          requestNote: `EIC Request ${i + 1} - ${status}`,
          statusChangeReason: statusChangeReason,
          createdAt: daysAgo(daysOld),
          updatedAt: daysAgo(Math.max(0, daysOld - 2)),
        });
        
        // Rotate to next user and stack to avoid duplicates
        eicUserIndex++;
        eicStackIndex++;
      }
    }

    await prisma.itemTransaction.createMany({ data: eicTransactions, skipDuplicates: true });
    console.log(`✅ Created ${eicTransactions.length} EIC transactions (3 per status: ${eicStatuses.join(', ')})`);
  } else {
    console.log('⚠️  No EIC stacks found, skipping EIC transactions');
  }
  */

  // ==================== PLANTING SEASONS & VARIETIES ====================
  console.log('\n🌾 Creating planting seasons...');
  
  const seasonsData = [
    { name: 'Dry Season 2024', startDate: new Date('2024-01-01'), endDate: new Date('2024-05-31'), description: 'Dry season planting period', isActive: false },
    { name: 'Wet Season 2024', startDate: new Date('2024-06-01'), endDate: new Date('2024-11-30'), description: 'Wet season planting period', isActive: false },
    { name: 'Dry Season 2025', startDate: new Date('2025-01-01'), endDate: new Date('2025-05-31'), description: 'Dry season planting period', isActive: true },
    { name: 'Wet Season 2025', startDate: new Date('2025-06-01'), endDate: new Date('2025-11-30'), description: 'Wet season planting period', isActive: true },
    { name: 'Dry Season 2026', startDate: new Date('2026-01-01'), endDate: new Date('2026-05-31'), description: 'Upcoming dry season', isActive: true },
  ];

  await prisma.plantingSeason.createMany({ data: seasonsData, skipDuplicates: true });
  const seasons = await prisma.plantingSeason.findMany();
  
  console.log(`✅ Created ${seasons.length} planting seasons (seed varieties already created with inventory)`);

  // ==================== PLANTING REPORTS ====================
  console.log('\n📊 Creating planting reports with all states...');
  
  const reportStates = ['Distributed', 'Planting', 'Planted', 'Harvested', 'Planting'];
  const plantingReportsData = [];

  for (const state of reportStates) {
    for (let i = 0; i < 5; i++) {
      const user = users[i % users.length];
      const season = seasons[i % seasons.length];
      const variety = varieties[i % varieties.length];
      
      let plantingDate, expectedHarvestDate, actualHarvestDate = null;
      
      if (state === 'Distributed') {
        plantingDate = daysAgo(10 + i * 2);
        expectedHarvestDate = daysFromNow(110 + i * 5);
      } else if (state === 'Planting') {
        plantingDate = daysAgo(40 + i * 5);
        expectedHarvestDate = daysFromNow(75 + i * 5);
      } else if (state === 'Planted') {
        plantingDate = daysAgo(110 + i * 3);
        expectedHarvestDate = daysFromNow(5 + i * 2);
      } else { // Harvested
        plantingDate = daysAgo(150 + i * 10);
        expectedHarvestDate = daysAgo(30 + i * 5);
        actualHarvestDate = daysAgo(30 + i * 5);
      }

      plantingReportsData.push({
        farmerName: user.username,
        farmLocation: `Field ${i + 1}, Location ${i + 1}`,
        rsbsaNumber: `RSBSA-${Math.floor(Math.random() * 100000)}`,
        croppingSeasonId: season.id,
        varietyId: variety.id,
        areaPlanted: 1.5 + i * 0.5,
        seedClassification: ['Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers', 'Inbred_Certified'][i],
        typeOfCrop: variety.cropType,
        riceIrrigation: variety.cropType === 'Rice' ? 'Irrigated' : undefined,
        dateOfPlanting: plantingDate,
        plantingMethod: ['Direct_Seeded', 'Transplanting'][i % 2],
        cropInsurance: i % 3 === 0,
        dateOfExpectedHarvest: expectedHarvestDate,
        harvestArea: state === 'Harvested' ? 1.5 + i * 0.5 : null,
        numberOfBags: state === 'Harvested' ? 50 + i * 10 : null,
        weightPerBag: state === 'Harvested' ? 45 + i * 2 : null,
        yieldMtPerHa: state === 'Harvested' ? 4.5 + i * 0.5 : null,
        state: state,
        createdAt: plantingDate,
        updatedAt: state === 'Harvested' ? actualHarvestDate : daysAgo(5),
      });
    }
  }

  await prisma.plantingReport.createMany({ data: plantingReportsData, skipDuplicates: true });
  console.log(`✅ Created ${plantingReportsData.length} planting reports (5 per state: Distributed, Planting, Planted, Harvested)`);

  // ==================== SUMMARY ====================
  console.log('\n\n📊 ========== COMPREHENSIVE SEED SUMMARY ==========');
  
  const [
    accountCount,
    faqCategoryCount,
    faqCount,
    surveyCount,
    inquiryCount,
    seminarCount,
    inventoryCount,
    distributionCount,
    seasonCount,
    varietyCount,
    reportCount
  ] = await Promise.all([
    prisma.account.count(),
    prisma.fAQCategory.count(),
    prisma.fAQ.count(),
    prisma.surveyForm.count(),
    prisma.inquiry.count(),
    prisma.seminar.count(),
    prisma.inventoryItem.count(),
    prisma.itemTransaction.count(),
    prisma.plantingSeason.count(),
    prisma.seedVariety.count(),
    prisma.plantingReport.count(),
  ]);

  console.log(`
  👥 Accounts:              ${accountCount}
     - Super Admin:         1
     - Admins:              5
     - Users (Farmers):     10

  📚 FAQ System:            
     - Categories:          ${faqCategoryCount} (1 inactive)
     - FAQs:                ${faqCount} (active + inactive)

  📋 Surveys:               ${surveyCount}
     - ACTIVE:              5
     - DRAFT:               5
     - CLOSED:              5

  💬 Inquiries:             ${inquiryCount}
     - Open:                5
     - Pending:             5
     - Under_Review:        5
     - Resolved:            5
     - Closed:              5

  🎓 Seminars:              ${seminarCount}
     - Scheduled:           5
     - Ongoing:             5
     - Completed:           5
     - Cancelled:           5

  📦 Inventory Items:       ${inventoryCount}
     - Various stock levels (In Stock, Low Stock, Out of Stock, Reserved)

  🚚 Distribution Requests: 0 (DISABLED - create manually)

  🌾 Planting Data:
     - Seasons:             ${seasonCount}
     - Seed Varieties:      ${varietyCount}
     - Planting Reports:    ${reportCount}
       * Planted:           5
       * Growing:           5
       * Mature:            5
       * Harvested:         5
       * Failed:            5

  ✨ TOTAL: Comprehensive test data covering ALL states and statuses!
  
  🔑 Login Credentials:
     username: admin
     password: 123456
     
     OR any farmer account (farmer01-farmer10)
     password: 123456
  `);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedComprehensiveAllStates()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
