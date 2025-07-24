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

      // Generate return date (only if status indicates item was returned)
      let returnDate = null;
      if (['Returned', 'late_return'].includes(status)) {
        // Return date should be after pickup date
        returnDate = faker.date.between({
          from: pickupDate,
          to: new Date(pickupDate.getTime() + 14 * 24 * 60 * 60 * 1000) // Up to 14 days after pickup
        });
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
  } 

  catch (error) {
    console.error('Error seeding data:', error);
  } 
  
  finally {
    await prisma.$disconnect();
  }
}

main();
