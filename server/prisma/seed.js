import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// Import data files
import users from './Data/account.json' with { type: 'json' }
import seminarsData from './Data/seminars.json' with { type: 'json' }
import inventoryItemsData from './Data/inventory_items.json' with { type: 'json' }
import inquiryData from './Data/inquiry.json' with { type: 'json' }

//? ========================================= ACCOUNT ========================================= ?//

async function createAccount() {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // Check if username already exists
    const existingUser = await prisma.account.findUnique({
      where: { username: user.username }
    });
    if (existingUser) {
      console.log(`User ${user.username} already exists, skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash("123456", 10)

    let picture = null;
    let mimeType = null;
    let imageName = null;
    let imagePath = null;

    if (i < 13) {
      const imageIndex = i + 1;
      imageName = `sample${imageIndex}`;

      if (imageIndex === 2) {
        imageName += '.jpeg';
        mimeType = 'image/jpeg';
      } else if (imageIndex === 3) {
        imageName += '.png';
        mimeType = 'image/png';
      } else {
        imageName += '.jpg';
        mimeType = 'image/jpeg';
      }

      try {

        imagePath = path.join(__dirname, '/Data/images/Accounts', imageName);
        
        if (imagePath) {
          picture = await sharp(imagePath).resize(300).jpeg({ quality: 80 }).toBuffer();
        }

      }
      catch (error) {
        console.error(`Error reading image ${imageName}:`, error);
        picture = null;
        mimeType = null;
      }
    }

    try{

      await prisma.account.create({
        data: {
          // Core authentication fields
          username: user.username,
          email: user.email,
          password: hashedPassword,
          access: user.access,
          
          // Personal Information
          firstName: user.firstName,
          middleName: user.middleName,
          surname: user.surname,
          extensionName: user.extensionName,
          sex: user.sex,
          
          // Address Information
          street: user.street,
          barangay: user.barangay,
          municipality: user.municipality,
          province: user.province,
          region: user.region,
          houseNumber: user.houseNumber,
          
          // Contact Information
          mobileNumber: user.mobileNumber,
          landlineNumber: user.landlineNumber,
          
          // Birth Information
          birthMunicipality: user.birthMunicipality,
          birthProvince: user.birthProvince,
          birthCountry: user.birthCountry,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
          
          // Personal Details
          religion: user.religion,
          otherReligionSpecify: user.otherReligionSpecify,
          civilStatus: user.civilStatus,
          spouseName: user.spouseName,
          
          // Household Information
          femaleHouseholdMembers: user.femaleHouseholdMembers,
          maleHouseholdMembers: user.maleHouseholdMembers,
          isHouseholdHead: user.isHouseholdHead === "Yes",
          householdHeadName: user.householdHeadName,
          relationshipToHead: user.relationshipToHead,
          
          // Government ID Information
          hasGovId: user.hasGovId === "Yes",
          govIdType: user.govIdType,
          govIdNumber: user.govIdNumber,
          
          // Education
          education: user.education,
          
          // PWD Information
          isPWD: user.isPWD === "Yes",
          disabilityType: user.disabilityType,
          
          // Livelihood Profile (as JSON)
          livelihoodProfile: user.livelihoodProfile,
          farmingActivities: user.farmingActivities,
          fishingActivities: user.fishingActivities,
          farmworkActivities: user.farmworkActivities,
          youthActivities: user.youthActivities,
          
          // Livelihood Specifications
          otherCropsSpecify: user.otherCropsSpecify,
          livestockSpecify: user.livestockSpecify,
          fishingOthersSpecify: user.fishingOthersSpecify,
          farmworkOthersSpecify: user.farmworkOthersSpecify,
          youthOthersSpecify: user.youthOthersSpecify,
          
          // Income Information
          grossAnnualIncome: user.grossAnnualIncome,
          incomeSource: user.incomeSource,
          
          // Profile Photo
          picture: picture,
          mimeType: mimeType,
          
          // Legacy fields (for compatibility)
          client_profile: user.client_profile,
          address: user.address,
        }
      })

      await wait(100);

    }
    catch(error){
      console.log(error);
    }
  }
}


//? ======================================== SEMINARS ======================================== ?//

async function createSeminars() {
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin'],
      },
    },
  });

  for (let i = 0; i < seminarsData.length; i++) {
    const seminar = seminarsData[i];

    let picture = null;
    let mimeType = null;
    let imageName = null;
    let imagePath = null;

    if (i < 19) {
      const imageIndex = i + 1;
      imageName = `sample${imageIndex}`;

      if (imageIndex === 19) {
        imageName += '.png';
        mimeType = 'image/png';
      }
      else {
        imageName += '.jpg';
        mimeType = 'image/jpeg';
      }
      try {
        imagePath = path.join(__dirname, '/Data/images/seminars', imageName);
        if (imagePath) {
          picture = await sharp(imagePath).resize(300).jpeg({ quality: 80 }).toBuffer();
        }
      } catch (error) {
        console.error(`Error reading image ${imageName}:`, error);
        picture = null;
        mimeType = null;
      }
    }

    // Select a random admin/superadmin account
    const randomIndex = Math.floor(Math.random() * adminAccounts.length);
    const createdByAccountId = adminAccounts[randomIndex].id;

    await prisma.seminar.create({
      data: {
        title: seminar.title,
        description: seminar.description,
        location: seminar.location,
        speaker: seminar.speaker,
        start_date: new Date(seminar.start_date),
        end_date: new Date(seminar.end_date),
        start_time: seminar.start_time,
        end_time: seminar.end_time,
        capacity: seminar.capacity,
        registration_deadline: new Date(seminar.registration_deadline),
        status: seminar.status,
        picture: picture,
        mimeType: mimeType,
        createdAt: new Date(seminar.createdAt),
        createdById: createdByAccountId,
      },
    });
  }
}

//? ================================= SEMINAR PARTICIPANTS ================================= ?//
async function createSeminarParticipants() {
  const seminars = await prisma.seminar.findMany();
  const accounts = await prisma.account.findMany();

  for (const seminar of seminars) {
    const now = new Date();

    // Randomly determine how many accounts will participate in this seminar
    const numberOfParticipants = Math.floor(Math.random() * accounts.length);

    // Shuffle the accounts array to pick participants randomly
    const shuffledAccounts = [...accounts].sort(() => Math.random() - 0.5);

    // Assign the randomly selected accounts to the seminar
    for (let i = 0; i < numberOfParticipants; i++) {
      const account = shuffledAccounts[i];

      // Check if this (seminar_id, account_id) pair already exists
      const existing = await prisma.seminarParticipant.findUnique({
        where: {
          seminar_id_account_id: {
            seminar_id: seminar.id,
            account_id: account.id,
          }
        }
      });

      if (!existing) {
        // Optionally, simulate different registration times by slightly offsetting the creation date
        const registrationTime = new Date(now.getTime() - Math.random() * (24 * 60 * 60 * 1000)); // Up to 24 hours ago

        //Determine status based on seminar status
        let participantStatus = 'Registered';

        // Cancelled
        if (seminar.status === 'Cancelled') {
          participantStatus = 'Cancelled';
        } 

        // Upcoming or Ongoing
        else if (seminar.status === 'Upcoming' || seminar.status === 'Ongoing') {
          const randomValue = Math.random();
          participantStatus = randomValue < 0.85 ? 'Registered' : 'Cancelled';
        } 

        // Completed
        else if (seminar.status === 'Completed') {
          const randomValue = Math.random();
          if (randomValue < 0.15) {
            participantStatus = 'Cancelled';
          } 
          else {
            const attendanceOptions = ['Attended', 'Not_Attended'];
            participantStatus = attendanceOptions[Math.floor(Math.random() * attendanceOptions.length)];
          }
        }

        await prisma.seminarParticipant.create({
          data: {
            seminar_id: seminar.id,
            account_id: account.id,
            status: participantStatus,
            createdAt: registrationTime,
          },
        });
      }
    }
  }
}


//? =================================== INVENTORY ITEMS =================================== ?//

async function createInventoryItems() {
  for (const item of inventoryItemsData) {
    // Check if item already exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { name: item.name }
    });
    
    if (!existingItem) {
      await prisma.inventoryItem.create({
        data: {
          name: item.name,
          description: item.description,
          category: item.category || 'Other'
        },
      });
    }
  }
}

//? ==================================== ITEM STACKS ==================================== ?//

import { faker } from '@faker-js/faker';
async function createItemStacks() {
  const inventoryItems = await prisma.inventoryItem.findMany();
  
  const statuses = ['Available', 'Unavailable', 'Damaged', 'EIC', 'Distributed'];

  for (const item of inventoryItems) {
    // Randomly select 1-3 statuses that will have quantities > 0
    const numberOfActiveStatuses = faker.number.int({ min: 1, max: 3 });
    const shuffledStatuses = [...statuses].sort(() => Math.random() - 0.5);
    const activeStatuses = shuffledStatuses.slice(0, numberOfActiveStatuses);

    // Create exactly one stack for each status for every item
    for (const status of statuses) {
      // Generate quantity based on whether this status is active
      const quantity = activeStatuses.includes(status) 
        ? faker.number.int({ min: 1, max: 50 }) 
        : 0;

      // Generate date_limit for some stacks (30% chance of having a limit)
      const hasDateLimit = Math.random() < 0.3;
      const dateLimit = hasDateLimit ? faker.number.int({ min: 1, max: 30 }) : null;

      await prisma.itemStack.create({
        data: {
          itemId: item.id,
          quantity: quantity,
          status: status,
          date_limit: dateLimit,
        },
      });

      await wait(50);
    }
  }
}

//? ================================== ITEM TRANSACTIONS ================================== ?//

async function createItemTransactions() {
  const itemStacks = await prisma.itemStack.findMany({
    where: {
      status: {
        in: ['EIC', 'Distributed'] // Only create transactions for EIC and Distributed stacks
      }
    }
  });
  
  // Get all accounts except admins for borrowing (only regular users can borrow)
  const regularAccounts = await prisma.account.findMany({
    where: {
      access: 'User' // Only regular users can borrow items
    }
  });
  
  // Get admin accounts for approving/rejecting
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });
  
  // If no regular users exist, skip creating transactions
  if (regularAccounts.length === 0) {
    console.log('No regular users found, skipping item transaction creation.');
    return;
  }
  
  const transactionStatuses = ['Pending', 'Approved', 'Rejected', 'Returned', 'No_Return', 'late_return', 'No_Pickup', 'Cancelled'];

  for (const stack of itemStacks) {
    // Skip creating transactions for stacks with 0 quantity
    if (stack.quantity === 0) {
      continue;
    }

    // Generate 0 to 3 transactions per stack (some stacks might have no transactions)
    const numberOfTransactions = Math.floor(Math.random() * 4);

    for (let i = 0; i < numberOfTransactions; i++) {
      // Select a random REGULAR USER account for this transaction (not admin)
      const randomAccountIndex = Math.floor(Math.random() * regularAccounts.length);
      const accountId = regularAccounts[randomAccountIndex].id;

      // Generate transaction quantity (should not exceed stack quantity)
      const maxQuantity = Math.min(stack.quantity, 10); // Cap at 10 for reasonable transactions
      const quantity = faker.number.int({ min: 1, max: maxQuantity });

      // Select random transaction status
      const status = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];

      // Generate pickup date (between 30 days ago and 30 days from now)
      const pickupDate = faker.date.between({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)    // 30 days from now
      });

      // Generate return date logic based on stack status
      let returnDate = null;
      
      if (stack.status === 'EIC') {
        // ALL EIC transactions should have a return date
        // Return date should be after pickup date (1 to 30 days later)
        returnDate = faker.date.between({
          from: new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000), // At least 1 day after pickup
          to: new Date(pickupDate.getTime() + 30 * 24 * 60 * 60 * 1000) // Up to 30 days after pickup
        });
      } else if (stack.status === 'Distributed') {
        // Distributed items don't need to be returned, so no return date
        returnDate = null;
      }

      // Assign admin ID if transaction has been processed (not Pending)
      let adminId = null;
      if (status !== 'Pending' && adminAccounts.length > 0) {
        const randomAdminIndex = Math.floor(Math.random() * adminAccounts.length);
        adminId = adminAccounts[randomAdminIndex].id;
      }

      // Generate random request note (50% chance of having a note)
      const hasRequestNote = Math.random() < 0.5;
      const requestNote = hasRequestNote ? faker.lorem.sentence() : null;

      await prisma.itemTransaction.create({
        data: {
          itemStackId: stack.id,
          accountId: accountId,
          adminId: adminId,
          quantity: quantity,
          status: status,
          pickupDate: pickupDate,
          returnDate: returnDate,
          requestNote: requestNote,
        },
      });

      await wait(50); // Small delay to avoid overwhelming the database
    }
  }
}

//? ===================================== AUDIT LOGS ===================================== ?//

async function createAuditLogs() {
  // Get all admin accounts for creating audit logs
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  if (adminAccounts.length === 0) {
    console.log('No admin accounts found, skipping audit log creation.');
    return;
  }

  // Get some existing entities for realistic audit logs
  const accounts = await prisma.account.findMany({ take: 10 });
  const inventoryItems = await prisma.inventoryItem.findMany({ take: 10 });
  const seminars = await prisma.seminar.findMany({ take: 5 });
  const itemStacks = await prisma.itemStack.findMany({ 
    include: { item: true },
    take: 10 
  });

  // Sample IP addresses for variety
  const sampleIPs = [
    '192.168.1.10', '192.168.1.15', '10.0.0.5', '172.16.0.20',
    '192.168.0.100', '10.1.1.50', '172.20.10.2', '192.168.1.25'
  ];

  // Sample User Agents
  const sampleUserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];

  // Define audit log templates with realistic scenarios
  const auditLogTemplates = [
    // Authentication Actions
    {
      action: 'LOGIN',
      targetType: null,
      getDetails: (admin) => `Admin ${admin.username} logged in successfully`,
      getMetadata: (admin) => ({ loginMethod: 'password', sessionDuration: null })
    },
    {
      action: 'LOGOUT',
      targetType: null,
      getDetails: (admin) => `Admin ${admin.username} logged out`,
      getMetadata: (admin) => ({ sessionDuration: faker.number.int({ min: 300, max: 7200 }) })
    },
    
    // Account Management Actions
    {
      action: 'ACCOUNT_CREATE',
      targetType: 'Account',
      getTarget: () => faker.helpers.arrayElement(accounts),
      getDetails: (admin, target) => `Created new user account for ${target.firstName} ${target.lastName}`,
      getMetadata: (admin, target) => ({
        newUserRole: target.access,
        email: target.email,
        clientProfile: target.client_profile
      })
    },
    {
      action: 'ACCOUNT_UPDATE',
      targetType: 'Account',
      getTarget: () => faker.helpers.arrayElement(accounts),
      getDetails: (admin, target) => `Updated account information for ${target.firstName} ${target.lastName}`,
      getMetadata: (admin, target) => ({
        updatedFields: faker.helpers.arrayElements(['email', 'phone', 'address', 'position'], { min: 1, max: 3 }),
        targetUserId: target.id
      })
    },
    {
      action: 'ACCOUNT_ROLE_CHANGE',
      targetType: 'Account',
      getTarget: () => faker.helpers.arrayElement(accounts),
      getDetails: (admin, target) => `Changed role for ${target.firstName} ${target.lastName} from User to ${faker.helpers.arrayElement(['Admin', 'User'])}`,
      getMetadata: (admin, target) => ({
        previousRole: 'User',
        newRole: faker.helpers.arrayElement(['Admin', 'User']),
        targetUserId: target.id
      })
    },

    // Inventory Management Actions
    {
      action: 'INVENTORY_CREATE',
      targetType: 'InventoryItem',
      getTarget: () => faker.helpers.arrayElement(inventoryItems),
      getDetails: (admin, target) => `Created new inventory item: ${target.name}`,
      getMetadata: (admin, target) => ({
        category: target.category,
        description: target.description,
        initialQuantity: faker.number.int({ min: 1, max: 100 })
      })
    },
    {
      action: 'INVENTORY_UPDATE',
      targetType: 'InventoryItem',
      getTarget: () => faker.helpers.arrayElement(inventoryItems),
      getDetails: (admin, target) => `Updated inventory item: ${target.name}`,
      getMetadata: (admin, target) => ({
        updatedFields: faker.helpers.arrayElements(['description', 'category', 'quantity'], { min: 1, max: 2 }),
        previousValues: { quantity: faker.number.int({ min: 0, max: 50 }) },
        newValues: { quantity: faker.number.int({ min: 0, max: 100 }) }
      })
    },
    {
      action: 'INVENTORY_STATUS_CHANGE',
      targetType: 'InventoryItem',
      getTarget: () => {
        const stack = faker.helpers.arrayElement(itemStacks);
        return {
          id: stack.item.id, // Use the actual inventory item ID
          name: stack.item.name, // Use the actual inventory item name
          quantity: stack.quantity,
          stackId: stack.id
        };
      },
      getDetails: (admin, target) => `Changed status of ${target.name} from Available to ${faker.helpers.arrayElement(['EIC', 'Distributed', 'Unavailable'])}`,
      getMetadata: (admin, target) => ({
        previousStatus: 'Available',
        newStatus: faker.helpers.arrayElement(['EIC', 'Distributed', 'Unavailable']),
        quantity: target.quantity,
        stackId: target.stackId
      })
    },

    // Distribution Management Actions
    {
      action: 'DISTRIBUTION_REQUEST_APPROVE',
      targetType: 'Distribution',
      getTarget: () => {
        const stack = faker.helpers.arrayElement(itemStacks);
        return { ...stack, name: stack.item.name };
      },
      getDetails: (admin, target) => `Approved distribution request for ${target.name}`,
      getMetadata: (admin, target) => ({
        requestedQuantity: faker.number.int({ min: 1, max: 10 }),
        availableStock: target.quantity,
        requestorInfo: faker.helpers.arrayElement(accounts).username
      })
    },
    {
      action: 'DISTRIBUTION_REQUEST_REJECT',
      targetType: 'Distribution',
      getTarget: () => {
        const stack = faker.helpers.arrayElement(itemStacks);
        return { ...stack, name: stack.item.name };
      },
      getDetails: (admin, target) => `Rejected distribution request for ${target.name}`,
      getMetadata: (admin, target) => ({
        requestedQuantity: faker.number.int({ min: 1, max: 10 }),
        availableStock: target.quantity,
        rejectionReason: faker.helpers.arrayElement(['Insufficient stock', 'Item not available', 'Invalid request'])
      })
    },

    // Seminar Management Actions
    {
      action: 'SEMINAR_CREATE',
      targetType: 'Seminar',
      getTarget: () => {
        const seminar = faker.helpers.arrayElement(seminars);
        return {
          id: seminar.id,
          title: seminar.title,
          speaker: seminar.speaker,
          location: seminar.location,
          capacity: seminar.capacity,
          start_date: seminar.start_date
        };
      },
      getDetails: (admin, target) => `Created new seminar: ${target.title}`,
      getMetadata: (admin, target) => ({
        speaker: target.speaker,
        location: target.location,
        capacity: target.capacity,
        startDate: target.start_date
      })
    },
    {
      action: 'SEMINAR_UPDATE',
      targetType: 'Seminar',
      getTarget: () => {
        const seminar = faker.helpers.arrayElement(seminars);
        return {
          id: seminar.id,
          title: seminar.title,
          speaker: seminar.speaker,
          location: seminar.location
        };
      },
      getDetails: (admin, target) => `Updated seminar details: ${target.title}`,
      getMetadata: (admin, target) => ({
        updatedFields: faker.helpers.arrayElements(['description', 'location', 'capacity', 'speaker'], { min: 1, max: 3 }),
        seminarId: target.id
      })
    },
    {
      action: 'SEMINAR_STATUS_CHANGE',
      targetType: 'Seminar',
      getTarget: () => {
        const seminar = faker.helpers.arrayElement(seminars);
        return {
          id: seminar.id,
          title: seminar.title,
          status: seminar.status
        };
      },
      getDetails: (admin, target) => `Changed seminar status: ${target.title} to ${faker.helpers.arrayElement(['Completed', 'Cancelled', 'Ongoing'])}`,
      getMetadata: (admin, target) => ({
        previousStatus: target.status,
        newStatus: faker.helpers.arrayElement(['Completed', 'Cancelled', 'Ongoing']),
        participantCount: faker.number.int({ min: 5, max: 50 })
      })
    },

    // System and Profile Actions
    {
      action: 'PROFILE_UPDATE',
      targetType: 'Account',
      getTarget: () => faker.helpers.arrayElement(adminAccounts),
      getDetails: (admin, target) => `Updated admin profile information`,
      getMetadata: (admin, target) => ({
        updatedFields: faker.helpers.arrayElements(['firstName', 'lastName', 'email', 'position'], { min: 1, max: 2 }),
        selfUpdate: target.id === admin.id
      })
    },
    {
      action: 'SETTINGS_UPDATE',
      targetType: null,
      getDetails: (admin) => `Updated system settings`,
      getMetadata: (admin) => ({
        settingsUpdated: faker.helpers.arrayElements(['notifications', 'security', 'backup', 'maintenance'], { min: 1, max: 3 }),
        previousValues: { notifications: true, security: 'medium' },
        newValues: { notifications: false, security: 'high' }
      })
    }
  ];

  // Generate audit logs over the past 90 days
  const now = new Date();
  const startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)); // 90 days ago

  // Generate 200-500 audit logs for realistic data
  const numberOfLogs = faker.number.int({ min: 200, max: 500 });

  for (let i = 0; i < numberOfLogs; i++) {
    // Select random admin
    const admin = faker.helpers.arrayElement(adminAccounts);
    
    // Select random audit log template
    const template = faker.helpers.arrayElement(auditLogTemplates);
    
    // Get target if template requires one
    let target = null;
    let targetId = null;
    let targetName = null;
    
    if (template.getTarget) {
      target = template.getTarget();
      targetId = target.id;
      
      // Determine targetName based on target type and available properties
      if (target.title) {
        targetName = target.title; // For seminars
      } else if (target.name) {
        targetName = target.name; // For inventory items, distributions, etc.
      } else if (target.firstName && target.lastName) {
        targetName = `${target.firstName} ${target.lastName}`; // For accounts
      } else {
        targetName = target.id; // Fallback to ID if no other name is available
      }
    }

    // Generate timestamp within the last 90 days
    const createdAt = faker.date.between({ from: startDate, to: now });
    
    // Generate details and metadata
    const details = template.getDetails(admin, target);
    const metadata = template.getMetadata ? template.getMetadata(admin, target) : null;
    
    // Select random IP and User Agent
    const ipAddress = faker.helpers.arrayElement(sampleIPs);
    const userAgent = faker.helpers.arrayElement(sampleUserAgents);

    try {
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: template.action,
          targetType: template.targetType,
          targetId: targetId,
          targetName: targetName,
          details: details,
          metadata: metadata ? JSON.stringify(metadata) : null,
          ipAddress: ipAddress,
          userAgent: userAgent,
          createdAt: createdAt
        }
      });

      // Small delay to avoid overwhelming the database
      if (i % 50 === 0) {
        await wait(100);
      }
    } catch (error) {
      console.error(`Error creating audit log ${i}:`, error);
    }
  }

  console.log(`Created ${numberOfLogs} audit log entries.`);
}

//? ===================================== INQUIRY SYSTEM ===================================== ?//

async function createFAQs() {
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  let orderIndex = 1;
  for (const faq of inquiryData.faqs) {
    const randomAdmin = adminAccounts[Math.floor(Math.random() * adminAccounts.length)];
    
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        isActive: faq.isActive,
        orderIndex: orderIndex++,
        viewCount: faq.viewCount || 0,
        helpfulCount: faq.helpfulCount || 0,
        createdById: randomAdmin.id,
        createdAt: faq.createdAt ? new Date(faq.createdAt) : new Date()
      }
    });
  }

  console.log(`Created ${inquiryData.faqs.length} FAQ entries.`);
}

async function createInquiryTemplates() {
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  for (const template of inquiryData.templates) {
    const randomAdmin = adminAccounts[Math.floor(Math.random() * adminAccounts.length)];
    
    await prisma.inquiryTemplate.create({
      data: {
        title: template.title,
        content: template.content,
        category: template.category,
        isActive: template.isActive,
        usageCount: template.usageCount || 0,
        createdById: randomAdmin.id,
        createdAt: template.createdAt ? new Date(template.createdAt) : new Date()
      }
    });
  }

  console.log(`Created ${inquiryData.templates.length} inquiry template entries.`);
}

async function createInquiries() {
  const userAccounts = await prisma.account.findMany({
    where: {
      access: 'User'  // Only regular users can create inquiries
    }
  });

  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  if (userAccounts.length === 0 || adminAccounts.length === 0) {
    console.log('No user or admin accounts found for creating inquiries.');
    return;
  }

  // Helper function to map status values
  const mapStatus = (status) => {
    const statusMap = {
      'RESOLVED': 'RESOLVED',
      'CLOSED': 'RESOLVED',
      'PENDING': 'PENDING',
      'IN_PROGRESS': 'IN_PROGRESS',
      'WAITING_USER': 'WAITING_USER',
      'CANCELLED': 'CANCELLED'
    };
    return statusMap[status] || 'PENDING';
  };

  for (const inquiryItem of inquiryData.inquiries) {
    const randomUser = userAccounts[Math.floor(Math.random() * userAccounts.length)];
    const randomAdmin = adminAccounts[Math.floor(Math.random() * adminAccounts.length)];

    // Create the inquiry
  const lifecycleStatus = mapStatus(inquiryItem.status);
  const shouldAssign = lifecycleStatus === 'IN_PROGRESS' || lifecycleStatus === 'WAITING_USER' || lifecycleStatus === 'RESOLVED';
  const createdInquiry = await prisma.inquiry.create({
      data: {
    subject: inquiryItem.title || inquiryItem.subject || 'Chat Inquiry',
    message: inquiryItem.description || inquiryItem.message || 'Initial inquiry message',
    status: lifecycleStatus,
        userId: randomUser.id,
    assignedToId: shouldAssign ? randomAdmin.id : null,
        createdAt: new Date(inquiryItem.createdAt),
      }
    });

    // Create replies for this inquiry
    for (let j = 0; j < inquiryItem.replies.length; j++) {
      const reply = inquiryItem.replies[j];
      
      await prisma.inquiryReply.create({
        data: {
          message: reply.message,
          senderId: reply.isFromUser ? randomUser.id : randomAdmin.id,
          senderType: reply.isFromUser ? 'USER' : 'ADMIN',
          senderName: reply.isFromUser ? `${randomUser.firstName} ${randomUser.surname}` : `${randomAdmin.firstName} ${randomAdmin.surname}`,
          inquiryId: createdInquiry.id,
          createdAt: new Date(reply.createdAt)
        }
      });
    }

    // Update inquiry timestamps
    await prisma.inquiry.update({
      where: { id: createdInquiry.id },
      data: {
        updatedAt: new Date(inquiryItem.updatedAt),
        resolvedAt: lifecycleStatus === 'RESOLVED' && inquiryItem.resolvedAt ? new Date(inquiryItem.resolvedAt) : null
      }
    });

    // Optionally add 0-2 attachments to some inquiries
    const attachCount = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;
    for (let k = 0; k < attachCount; k++) {
        const fakeName = `sample_${k + 1}.jpg`;
        try {
          await prisma.inquiryAttachment.create({
            data: {
              inquiryId: createdInquiry.id,
              filename: fakeName,
              filepath: null,
              filesize: 123456,
              mimetype: 'image/jpeg',
              uploadedById: randomUser.id,
              fileData: Buffer.from([137,80,78,71]), // PNG header bytes as placeholder
            },
          });
        } catch (e) {
          await prisma.inquiryAttachment.create({
            data: {
              inquiryId: createdInquiry.id,
              filename: fakeName,
              filepath: null,
              filesize: 123456,
              mimetype: 'image/jpeg',
              uploadedById: randomUser.id,
            },
          });
        }
    }
  }

  console.log(`Created ${inquiryData.inquiries.length} inquiries with their replies.`);
}

async function createInquiryAnalytics() {
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  if (adminAccounts.length === 0) {
    console.log('No admin accounts found for creating inquiry analytics.');
    return;
  }

  for (const analytics of inquiryData.analytics) {
    const randomAdmin = adminAccounts[Math.floor(Math.random() * adminAccounts.length)];
    
    await prisma.inquiryAnalytics.create({
      data: {
        date: new Date(analytics.date),
        totalInquiries: analytics.totalInquiries,
        resolvedInquiries: analytics.resolvedInquiries,
        pendingInquiries: analytics.pendingInquiries,
        avgResponseTime: analytics.avgResponseTime,
        adminResponseRate: analytics.adminResponseRate,
        categoryBreakdown: analytics.categoryBreakdown,
        adminId: randomAdmin.id
      }
    });
  }

  console.log(`Created ${inquiryData.analytics.length} inquiry analytics entries.`);
}

//? ===================================== SURVEY FORMS ===================================== ?//

async function createSurveyForms() {
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  if (adminAccounts.length === 0) {
    console.log('No admin accounts found for creating survey forms.');
    return;
  }

  const surveyFormsData = [
    {
      title: "Equipment Request Feedback Survey",
      description: "Help us improve our equipment distribution process by sharing your feedback about the request and approval workflow.",
      status: "ACTIVE",
      category: "equipment",
      fields: [
        {
          type: "TEXT",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
          order: 1
        },
        {
          type: "EMAIL",
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: true,
          order: 2
        },
        {
          type: "SELECT",
          label: "Equipment Category",
          placeholder: "",
          required: true,
          options: ["Farming Tools", "Irrigation Equipment", "Harvesting Equipment", "Processing Equipment", "Other"],
          order: 3
        },
        {
          type: "RADIO",
          label: "Overall Satisfaction",
          placeholder: "",
          required: true,
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
          order: 4
        },
        {
          type: "TEXTAREA",
          label: "Additional Comments",
          placeholder: "Please share any additional feedback or suggestions...",
          required: false,
          order: 5
        }
      ]
    },
    {
      title: "Agricultural Seminar Evaluation",
      description: "Rate your experience attending our agricultural seminars and help us improve future events.",
      status: "ACTIVE",
      category: "seminar",
      fields: [
        {
          type: "TEXT",
          label: "Participant Name",
          placeholder: "Enter your name",
          required: true,
          order: 1
        },
        {
          type: "SELECT",
          label: "Seminar Attended",
          placeholder: "Select the seminar you attended",
          required: true,
          options: ["Sustainable Farming Techniques", "Crop Disease Management", "Irrigation Systems", "Post-Harvest Processing", "Market Linkage"],
          order: 2
        },
        {
          type: "RADIO",
          label: "Content Quality",
          placeholder: "",
          required: true,
          options: ["Excellent", "Good", "Average", "Poor"],
          order: 3
        },
        {
          type: "RADIO",
          label: "Speaker Effectiveness",
          placeholder: "",
          required: true,
          options: ["Excellent", "Good", "Average", "Poor"],
          order: 4
        },
        {
          type: "CHECKBOX",
          label: "Topics of Interest for Future Seminars",
          placeholder: "",
          required: false,
          options: ["Organic Farming", "Climate-Smart Agriculture", "Farm Business Management", "Technology in Agriculture", "Water Conservation"],
          order: 5
        },
        {
          type: "NUMBER",
          label: "How likely are you to recommend this seminar? (1-10)",
          placeholder: "Rate from 1 to 10",
          required: true,
          order: 6
        }
      ]
    },
    {
      title: "Farm Profile Registration",
      description: "Register your farm details to help us provide better agricultural support and services.",
      status: "ACTIVE",
      category: "agriculture",
      fields: [
        {
          type: "TEXT",
          label: "Farm Name",
          placeholder: "Enter your farm name",
          required: true,
          order: 1
        },
        {
          type: "TEXT",
          label: "Farmer Name",
          placeholder: "Enter your full name",
          required: true,
          order: 2
        },
        {
          type: "EMAIL",
          label: "Contact Email",
          placeholder: "your.email@example.com",
          required: true,
          order: 3
        },
        {
          type: "TEXT",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          required: true,
          order: 4
        },
        {
          type: "TEXTAREA",
          label: "Farm Location",
          placeholder: "Provide detailed farm location/address",
          required: true,
          order: 5
        },
        {
          type: "NUMBER",
          label: "Farm Size (hectares)",
          placeholder: "Enter farm size in hectares",
          required: true,
          order: 6
        },
        {
          type: "CHECKBOX",
          label: "Crops Grown",
          placeholder: "",
          required: true,
          options: ["Rice", "Corn", "Vegetables", "Fruits", "Root Crops", "Legumes", "Other"],
          order: 7
        },
        {
          type: "SELECT",
          label: "Farming Experience",
          placeholder: "Select your farming experience level",
          required: true,
          options: ["Less than 1 year", "1-5 years", "6-10 years", "11-20 years", "More than 20 years"],
          order: 8
        }
      ]
    },
    {
      title: "Service Quality Feedback",
      description: "Help us improve our services by providing feedback on your recent interaction with our team.",
      status: "ACTIVE",
      category: "feedback",
      fields: [
        {
          type: "TEXT",
          label: "Your Name",
          placeholder: "Enter your name",
          required: true,
          order: 1
        },
        {
          type: "DATE",
          label: "Date of Service",
          placeholder: "",
          required: true,
          order: 2
        },
        {
          type: "SELECT",
          label: "Service Type",
          placeholder: "Select the service you received",
          required: true,
          options: ["Equipment Distribution", "Technical Consultation", "Training/Seminar", "Information Request", "Other"],
          order: 3
        },
        {
          type: "RADIO",
          label: "Service Quality Rating",
          placeholder: "",
          required: true,
          options: ["Excellent", "Good", "Satisfactory", "Needs Improvement", "Poor"],
          order: 4
        },
        {
          type: "RADIO",
          label: "Staff Responsiveness",
          placeholder: "",
          required: true,
          options: ["Very Responsive", "Responsive", "Adequate", "Slow", "Very Slow"],
          order: 5
        },
        {
          type: "TEXTAREA",
          label: "Suggestions for Improvement",
          placeholder: "Share your suggestions on how we can improve our services...",
          required: false,
          order: 6
        }
      ]
    },
    {
      title: "Annual Agricultural Report Survey",
      description: "Contribute to our annual agricultural report by sharing information about your farming activities and challenges.",
      status: "DRAFT",
      category: "general",
      fields: [
        {
          type: "TEXT",
          label: "Farmer/Organization Name",
          placeholder: "Enter name",
          required: true,
          order: 1
        },
        {
          type: "SELECT",
          label: "Primary Crop Type",
          placeholder: "Select your main crop",
          required: true,
          options: ["Rice", "Corn", "Coconut", "Sugarcane", "Banana", "Other Vegetables", "Mixed Farming"],
          order: 2
        },
        {
          type: "NUMBER",
          label: "Total Production This Year (tons)",
          placeholder: "Enter production amount",
          required: true,
          order: 3
        },
        {
          type: "CHECKBOX",
          label: "Challenges Faced This Year",
          placeholder: "",
          required: false,
          options: ["Weather/Climate", "Pest and Diseases", "Market Access", "Financing", "Technology Access", "Labor Shortage"],
          order: 4
        },
        {
          type: "RADIO",
          label: "Income Level Compared to Last Year",
          placeholder: "",
          required: true,
          options: ["Significantly Increased", "Slightly Increased", "Same", "Slightly Decreased", "Significantly Decreased"],
          order: 5
        },
        {
          type: "TEXTAREA",
          label: "Additional Comments or Recommendations",
          placeholder: "Share any additional information that might be helpful for our report...",
          required: false,
          order: 6
        }
      ]
    }
  ];

  for (let i = 0; i < surveyFormsData.length; i++) {
    const surveyData = surveyFormsData[i];
    const randomAdmin = adminAccounts[Math.floor(Math.random() * adminAccounts.length)];

    // Create survey form
    const createdSurvey = await prisma.surveyForm.create({
      data: {
        title: surveyData.title,
        description: surveyData.description,
        status: surveyData.status,
        category: surveyData.category,
        createdById: randomAdmin.id,
        createdAt: faker.date.between({
          from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          to: new Date()
        })
      }
    });

    // Create survey fields
    for (const fieldData of surveyData.fields) {
      await prisma.surveyField.create({
        data: {
          surveyFormId: createdSurvey.id,
          type: fieldData.type,
          label: fieldData.label,
          placeholder: fieldData.placeholder,
          required: fieldData.required,
          options: fieldData.options || null,
          order: fieldData.order
        }
      });
    }

    await wait(100);
  }

  console.log(`Created ${surveyFormsData.length} survey forms with their fields.`);
}

async function createSurveyResponses() {
  const surveyForms = await prisma.surveyForm.findMany({
    include: {
      fields: true
    }
  });

  const userAccounts = await prisma.account.findMany({
    where: {
      access: 'User'
    }
  });

  if (surveyForms.length === 0 || userAccounts.length === 0) {
    console.log('No survey forms or user accounts found for creating responses.');
    return;
  }

  // Sample response data for different field types
  const sampleTextResponses = [
    "John Doe", "Maria Santos", "Roberto Cruz", "Ana Garcia", "Carlos Mendoza",
    "Elena Rodriguez", "Miguel Torres", "Sofia Reyes", "Diego Morales", "Isabella Flores"
  ];

  const sampleEmailResponses = [
    "john.doe@email.com", "maria.santos@email.com", "roberto.cruz@email.com",
    "ana.garcia@email.com", "carlos.mendoza@email.com"
  ];

  const sampleTextareaResponses = [
    "This service was very helpful and the staff was knowledgeable.",
    "I appreciate the quick response time and professional service.",
    "The equipment provided was in excellent condition and very useful.",
    "Could improve the waiting time but overall satisfied with the service.",
    "Excellent training session, learned many practical techniques.",
    "The seminar content was very relevant to my farming needs.",
    "Good service but could use more variety in equipment options.",
    "Staff was friendly and patient in explaining the procedures."
  ];

  const sampleLocationResponses = [
    "Barangay San Miguel, Lipa City, Batangas",
    "Barangay Poblacion, Tanauan City, Batangas",
    "Barangay Malvar, Malvar, Batangas",
    "Barangay Santo Tomas, Santo Tomas, Batangas",
    "Barangay Balete, Balete, Batangas"
  ];

  for (const survey of surveyForms) {
    // Generate 10-50 responses per survey
    const numberOfResponses = faker.number.int({ min: 10, max: 50 });

    for (let i = 0; i < numberOfResponses; i++) {
      const randomUser = userAccounts[Math.floor(Math.random() * userAccounts.length)];
      
      // Create survey response
      const createdResponse = await prisma.surveyResponse.create({
        data: {
          surveyFormId: survey.id,
          userId: randomUser.id,
          submittedAt: faker.date.between({
            from: new Date(survey.createdAt),
            to: new Date()
          })
        }
      });

      // Create answers for each field
      for (const field of survey.fields) {
        let answerValue = '';

        switch (field.type) {
          case 'TEXT':
            if (field.label.toLowerCase().includes('name')) {
              answerValue = faker.helpers.arrayElement(sampleTextResponses);
            } else if (field.label.toLowerCase().includes('phone')) {
              answerValue = faker.phone.number();
            } else if (field.label.toLowerCase().includes('farm')) {
              answerValue = `${faker.helpers.arrayElement(['Sunrise', 'Green Valley', 'Golden Harvest', 'Peaceful', 'Abundant'])} Farm`;
            } else {
              answerValue = faker.lorem.words({ min: 2, max: 4 });
            }
            break;

          case 'EMAIL':
            answerValue = faker.helpers.arrayElement(sampleEmailResponses);
            break;

          case 'TEXTAREA':
            if (field.label.toLowerCase().includes('location') || field.label.toLowerCase().includes('address')) {
              answerValue = faker.helpers.arrayElement(sampleLocationResponses);
            } else {
              answerValue = faker.helpers.arrayElement(sampleTextareaResponses);
            }
            break;

          case 'NUMBER':
            if (field.label.toLowerCase().includes('size')) {
              answerValue = faker.number.float({ min: 0.5, max: 10, fractionDigits: 1 }).toString();
            } else if (field.label.toLowerCase().includes('production')) {
              answerValue = faker.number.int({ min: 1, max: 100 }).toString();
            } else if (field.label.toLowerCase().includes('recommend')) {
              answerValue = faker.number.int({ min: 1, max: 10 }).toString();
            } else {
              answerValue = faker.number.int({ min: 1, max: 50 }).toString();
            }
            break;

          case 'DATE':
            answerValue = faker.date.between({
              from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
              to: new Date()
            }).toISOString().split('T')[0];
            break;

          case 'SELECT':
          case 'RADIO':
            if (field.options && field.options.length > 0) {
              answerValue = faker.helpers.arrayElement(field.options);
            }
            break;

          case 'CHECKBOX':
            if (field.options && field.options.length > 0) {
              // Select 1-3 random options
              const numSelections = faker.number.int({ min: 1, max: Math.min(3, field.options.length) });
              const selectedOptions = faker.helpers.arrayElements(field.options, numSelections);
              answerValue = selectedOptions.join(', ');
            }
            break;

          case 'FILE':
            answerValue = 'sample_document.pdf';
            break;

          default:
            answerValue = faker.lorem.sentence();
        }

        await prisma.surveyAnswer.create({
          data: {
            responseId: createdResponse.id,
            fieldId: field.id,
            answer: answerValue
          }
        });
      }
    }
  }

  console.log('Created survey responses with answers for all survey forms.');
}

async function createSurveyStatistics() {
  const adminAccounts = await prisma.account.findMany({
    where: {
      access: {
        in: ['Admin', 'Super_Admin']
      }
    }
  });

  const surveyForms = await prisma.surveyForm.findMany();

  if (adminAccounts.length === 0 || surveyForms.length === 0) {
    console.log('No admin accounts or survey forms found for creating statistics.');
    return;
  }

  const statisticsData = [
    {
      title: "Equipment Request Satisfaction Analysis",
      description: "Analysis of satisfaction levels across equipment request categories",
      chartType: "PIE",
      chartConfig: {
        labels: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
        datasets: [{
          data: [45, 35, 12, 6, 2],
          backgroundColor: ["#10B981", "#34D399", "#FCD34D", "#F97316", "#EF4444"]
        }]
      },
      filters: {
        dateRange: "last_30_days",
        category: "equipment"
      }
    },
    {
      title: "Seminar Attendance by Topic",
      description: "Distribution of seminar attendance across different agricultural topics",
      chartType: "BAR",
      chartConfig: {
        labels: ["Sustainable Farming", "Disease Management", "Irrigation", "Post-Harvest", "Market Linkage"],
        datasets: [{
          label: "Participants",
          data: [85, 72, 68, 58, 45],
          backgroundColor: "#10B981"
        }]
      },
      filters: {
        dateRange: "last_3_months",
        category: "seminar"
      }
    },
    {
      title: "Service Quality Trends",
      description: "Monthly trends in service quality ratings over time",
      chartType: "LINE",
      chartConfig: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Average Rating",
          data: [4.2, 4.3, 4.1, 4.5, 4.4, 4.6],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        }]
      },
      filters: {
        dateRange: "last_6_months",
        category: "feedback"
      }
    }
  ];

  for (let i = 0; i < statisticsData.length; i++) {
    const stat = statisticsData[i];
    const randomAdmin = adminAccounts[Math.floor(Math.random() * adminAccounts.length)];
    const randomSurvey = surveyForms[Math.floor(Math.random() * surveyForms.length)];

    await prisma.surveyStatistic.create({
      data: {
        surveyFormId: randomSurvey.id,
        title: stat.title,
        description: stat.description,
        chartType: stat.chartType,
        config: stat.chartConfig,
        createdById: randomAdmin.id,
        createdAt: faker.date.between({
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          to: new Date()
        })
      }
    });
  }

  console.log(`Created ${statisticsData.length} survey statistics.`);
}

//? ===================================== USER PREFERENCES ===================================== ?//

async function createUserPreferences() {
  const accounts = await prisma.account.findMany();

  if (accounts.length === 0) {
    console.log('No accounts found for creating user preferences.');
    return;
  }

  // Default preferences that all users should have
  const defaultPreferences = [
    { key: 'theme', value: 'light' }, // Default to light mode
    { key: 'language', value: 'en' },
    { key: 'notification_email_seminar_updates', value: 'true' },
    { key: 'notification_email_equipment_status', value: 'true' },
    { key: 'notification_email_announcements', value: 'true' },
    { key: 'notification_push_seminar_reminders', value: 'true' },
    { key: 'notification_push_equipment_reminders', value: 'true' },
    { key: 'privacy_profile_visibility', value: 'public' },
    { key: 'dashboard_show_weather', value: 'true' },
    { key: 'dashboard_show_tips', value: 'true' },
    { key: 'auto_save_drafts', value: 'true' }
  ];

  // Some users will have different theme preferences for variety
  const themeVariations = ['light', 'dark', 'auto'];
  const languageVariations = ['en', 'tl']; // English and Tagalog

  for (const account of accounts) {
    for (const pref of defaultPreferences) {
      let value = pref.value;

      // Add some variety to certain preferences
      if (pref.key === 'theme') {
        // 70% light, 20% dark, 10% auto
        const rand = Math.random();
        if (rand < 0.7) {
          value = 'light';
        } else if (rand < 0.9) {
          value = 'dark';
        } else {
          value = 'auto';
        }
      } else if (pref.key === 'language') {
        // 80% English, 20% Tagalog
        value = Math.random() < 0.8 ? 'en' : 'tl';
      } else if (pref.key.includes('notification')) {
        // 85% enable notifications, 15% disable
        value = Math.random() < 0.85 ? 'true' : 'false';
      }

      // Check if preference already exists
      const existingPref = await prisma.userPreference.findUnique({
        where: {
          userId_key: {
            userId: account.id,
            key: pref.key
          }
        }
      });

      if (!existingPref) {
        await prisma.userPreference.create({
          data: {
            userId: account.id,
            key: pref.key,
            value: value,
            createdAt: faker.date.between({
              from: new Date(account.createdAt),
              to: new Date()
            })
          }
        });
      }
    }

    // Add a small delay to avoid overwhelming the database
    await wait(50);
  }

  console.log(`Created user preferences for ${accounts.length} accounts.`);
}

//? ====================================== EXECUTE SEEDS ====================================== ?//

// Seed Tracking: Registered Crops and Monthly Reports
async function createRegisteredCropsAndReports() {
  const users = await prisma.account.findMany({ where: { access: 'User' } });
  if (users.length === 0) {
    console.log('No users found for seed tracking. Skipping crop/report seeds.');
    return;
  }

  const cropTypes = [
    { type: 'Rice', varieties: ['IR64', 'NSIC Rc222', 'PSB Rc18'] },
    { type: 'Corn', varieties: ['Sweet Corn', 'Glutinous', 'Hybrid 888'] },
    { type: 'Tomato', varieties: ['Roma', 'Celebrity', 'Cherokee Purple'] },
    { type: 'Eggplant', varieties: ['Black Beauty', 'Long Purple', 'Lumina'] },
  ];

  // Create 1-3 crops per user
  for (const user of users) {
    const cropCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < cropCount; i++) {
      const pick = faker.helpers.arrayElement(cropTypes);
      const variety = faker.helpers.arrayElement(pick.varieties);
      const plantingDate = faker.date.between({
        from: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      });
      const expectedHarvest = faker.date.between({
        from: new Date(plantingDate.getTime() + 60 * 24 * 60 * 60 * 1000),
        to: new Date(plantingDate.getTime() + 150 * 24 * 60 * 60 * 1000),
      });
      const area = faker.number.float({ min: 0.2, max: 3.0, fractionDigits: 1 });
      const expectedYield = faker.number.int({ min: 1000, max: 15000 });

      const createdCrop = await prisma.registeredCrop.create({
        data: {
          userId: user.id,
          cropType: pick.type,
          variety,
          plantingDate,
          expectedHarvest,
          area,
          expectedYield,
          currentStage: faker.helpers.arrayElement(['Seedling','Vegetative','Flowering','Fruiting','Maturity']),
          status: 'Active',
          notes: faker.lorem.sentence(),
        },
      });

      // Create 1-4 monthly reports per crop
      const reportCount = faker.number.int({ min: 1, max: 4 });
      for (let r = 0; r < reportCount; r++) {
        const reportDate = faker.date.between({
          from: plantingDate,
          to: new Date(),
        });
        const growthStage = faker.helpers.arrayElement(['Seedling','Vegetative','Flowering','Fruiting','Maturity']);
        await prisma.cropMonthlyReport.create({
          data: {
            cropId: createdCrop.id,
            reportDate,
            growthStage,
            plantHeight: faker.number.float({ min: 5, max: 180, fractionDigits: 1 }),
            healthStatus: faker.helpers.arrayElement(['Healthy','Good','Fair','Poor']),
            estimatedYield: faker.number.int({ min: 500, max: 15000 }),
            weatherImpact: faker.helpers.arrayElement(['Favorable','Neutral','Adverse']),
            notes: faker.lorem.sentence(),
            pestsObserved: faker.helpers.arrayElement(['None','Aphids','Armyworm','Fruit fly']),
            diseasesObserved: faker.helpers.arrayElement(['None','Leaf spot','Blight','Wilt']),
            fertilizersApplied: faker.helpers.arrayElement(['Urea','NPK 14-14-14','Organic compost']),
            pesticideApplications: faker.helpers.arrayElement(['None','Neem oil','Carbaryl','Bacillus thuringiensis']),
            irrigationFrequency: faker.helpers.arrayElement(['Daily','Every 3 days','Weekly']),
            soilCondition: faker.helpers.arrayElement(['Moist','Dry','Water-logged','Well-drained']),
            majorActivities: faker.helpers.arrayElement(['Weeding','Irrigation','Fertilizing','Harvest prep']),
            challenges: faker.helpers.arrayElement(['None','Pest pressure','Drought','Heavy rain']),
            plannedActions: faker.helpers.arrayElement(['Apply pesticide','Increase irrigation','Improve drainage']),
            actualYield: faker.number.int({ min: 300, max: 16000 }),
            costs: {
              seeds: faker.number.int({ min: 100, max: 1000 }),
              fertilizer: faker.number.int({ min: 200, max: 2000 }),
              pesticides: faker.number.int({ min: 0, max: 1500 }),
              labor: faker.number.int({ min: 500, max: 5000 }),
              irrigation: faker.number.int({ min: 100, max: 1500 }),
              equipment: faker.number.int({ min: 0, max: 3000 }),
              others: faker.number.int({ min: 0, max: 1000 }),
            },
            weatherSnapshot: {
              temperature: faker.number.int({ min: 20, max: 36 }),
              humidity: faker.number.int({ min: 40, max: 95 }),
              precipitation: faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
              windSpeed: faker.number.int({ min: 0, max: 40 }),
            },
          },
        });
      }
    }
  }

  console.log('Registered crops and monthly reports created successfully.');
}

async function main() {
  try {
    await createAccount();
    console.log('Accounts created successfully.');

    await createSeminars();
    console.log('Seminars created successfully.');

    await createSeminarParticipants();
    console.log('Seminar Participants created successfully.');
    
    await createInventoryItems();
    console.log('Inventory Items created successfully.');
    
    await createItemStacks();
    console.log('Inventory Item Stacks created successfully.');
    
    await createItemTransactions();
    console.log('Item Transactions created successfully.');
    
    await createAuditLogs();
    console.log('Audit Logs created successfully.');

    await createFAQs();
    console.log('FAQs created successfully.');
    
    /*
    await createInquiryTemplates();
    console.log('Inquiry Templates created successfully.');
    */
    
    await createInquiries();
    console.log('Inquiries created successfully.');
    
    /*
    await createInquiryAnalytics();
    console.log('Inquiry Analytics created successfully.');
    */

    await createSurveyForms();
    console.log('Survey Forms created successfully.');
    
    await createSurveyResponses();
    console.log('Survey Responses created successfully.');
    
    await createSurveyStatistics();
    console.log('Survey Statistics created successfully.');

    await createUserPreferences();
    console.log('User Preferences created successfully.');

  await createRegisteredCropsAndReports();
  console.log('Seed Tracking data created successfully.');
  } 

  catch (error) {
    console.error('Error seeding data:', error);
  } 
  
  finally {
    await prisma.$disconnect();
  }
}

main();
