import { PrismaClient } from './generated/client.js'
import bcrypt from 'bcrypt'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const prisma = new PrismaClient()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wait = (ms) => new Promise((res) => setTimeout(res, ms));


//? ========================================= ACCOUNT ========================================= ?//
import users from './Data/account.json' with { type: 'json' }

async function createAccount() {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // Check if username already exists
    const existingUser = await prisma.account.findUnique({
      where: { username: user.username }
    });
    if (existingUser) {
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
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: hashedPassword,
          access: user.access,
          client_profile: user.client_profile,
          middleName: user.middleName,
          gender: user.gender,
          cellphone_no: user.cellphone_no,
          telephone_no: user.telephone_no,
          occupation: user.occupation,
          institution: user.institution,
          position: user.position,
          address: user.address,
          picture: picture,
          mimeType: mimeType,
        }
      })

      await wait(100);

    }
    catch(error){
      console.log(error);
    }
  }
}


//? ======================================== COMMODITY ======================================== ?//

import commodities from './Data/commodities.json' with { type: 'json' }

async function createCommodities() {
  for (const commodity of commodities) {
    // Check if commodity with the same name already exists
    const existingCommodity = await prisma.commodity.findUnique({
      where: { name: commodity.name }
    });
    if (existingCommodity) {
      continue;
    }
    await prisma.commodity.create({
      data: {
        name: commodity.name,
        description: commodity.description,
      },
    });
  }
}

//? ==================================== ACCOUNT COMMODITIES =================================== ?//

async function createAccountCommodities() {
  const accountsData = await prisma.account.findMany();
  const commoditiesData = await prisma.commodity.findMany();

  for (const account of accountsData) {
    // Randomly determine how many commodities this account will have
    const numberOfCommodities = Math.floor(Math.random() * commoditiesData.length);

    // Shuffle the commodities array to pick commodities randomly
    const shuffledCommodities = [...commoditiesData.sort(() => Math.random() - 0.5)];

    // Track which commodity IDs have already been assigned to this account
    const assignedCommodityIds = new Set();

    // Assign the randomly selected commodities to the account
    for (let i = 0; i < numberOfCommodities; i++) {
      const commodity = shuffledCommodities[i];
      // Check if this (account_id, commodity_id) pair already exists
      if (assignedCommodityIds.has(commodity.id)) {
        continue;
      }
      const existing = await prisma.accountCommodity.findUnique({
        where: {
          account_id_commodity_id: {
            account_id: account.id,
            commodity_id: commodity.id
          }
        }
      });
      if (!existing) {
        await prisma.accountCommodity.create({
          data: {
            account_id: account.id,
            commodity_id: commodity.id,
          },
        });
        assignedCommodityIds.add(commodity.id);
      }
    }
  }
}

//? ======================================== SEMINARS ======================================== ?//

import seminarsData from './Data/seminars.json' with { type: 'json' }
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

import inventoryItemsData from './Data/inventory_items.json' with { type: 'json' }

async function createInventoryItems() {
  for (const item of inventoryItemsData) {

    await prisma.inventoryItem.create({
      data: {
        name: item.name,
        description: item.description,
        category: item.category || 'Other'
      },
    });
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

//? ====================================== EXECUTE SEEDS ====================================== ?//

async function main() {
  try {
    await createAccount();
    console.log('Accounts created successfully.');

    await createCommodities();
    console.log('Commodities created successfully.');

    await createAccountCommodities();
    console.log('Account Commodities created successfully.');

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
  } 

  catch (error) {
    console.error('Error seeding data:', error);
  } 
  
  finally {
    await prisma.$disconnect();
  }
}

main();
