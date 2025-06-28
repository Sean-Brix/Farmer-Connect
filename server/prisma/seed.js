import { PrismaClient } from './generated/client.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

//? ========================================= ACCOUNT ========================================= ?//

import users from './Data/account.json' with { type: 'json' }

async function createAccount() {
  for (const user of users) {

    // Check if username already exists
    const existingUser = await prisma.account.findUnique({
      where: { username: user.username }
    });
    if (existingUser) {
      continue;
    }

    const hashedPassword = await bcrypt.hash("123456", 10)

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
        position: user.position,
        address: user.address
      }
    })
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
  for (const seminar of seminarsData) {
    await prisma.seminar.create({
      data: {
        title: seminar.title,
        description: seminar.description,
        location: seminar.location,
        speaker: seminar.speaker,
        start_date: new Date(seminar.start_date),
        end_date: new Date(seminar.end_date),
        start_time: new Date(seminar.start_time),
        end_time: new Date(seminar.end_time),
        capacity: seminar.capacity,
        registration_deadline: new Date(seminar.registration_deadline),
        status: seminar.status,
        photo: seminar.photo,
      },
    });
  }
}

//? ================================= SEMINAR PARTICIPANTS ================================= ?//

async function createSeminarParticipants() {
    const seminars = await prisma.seminar.findMany();
    const accounts = await prisma.account.findMany();

    for (const seminar of seminars) {
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
                await prisma.seminarParticipant.create({
                    data: {
                        seminar_id: seminar.id,
                        account_id: account.id,
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
    // Check if item with the same id already exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: item.id }
    });
    if (existingItem) {
      continue;
    }
    await prisma.inventoryItem.create({
      data: {
        id: item.id,
        name: item.name,
        description: item.description,
        category: {
          connect: { id: item.categoryId }
        }
      },
    });
  }
}

//? =============================== INVENTORY CATEGORIES =============================== ?//

import inventoryCategoriesData from './Data/inventory_category.json' with { type: 'json' }

async function createInventoryCategories() {
  for (const category of inventoryCategoriesData) {
    // Check if category with the same id already exists
    const existingCategory = await prisma.inventoryCategory.findUnique({
      where: { id: category.id }
    });
    if (existingCategory) {
      continue;
    }
    await prisma.inventoryCategory.create({
      data: {
        id: category.id,
        name: category.name,
        icon: null,
        description: category.description,
      },
    });
  }
}

//? ==================================== ITEM STACKS ==================================== ?//

import { faker } from '@faker-js/faker';
async function createItemStacks() {
  const inventoryItems = await prisma.inventoryItem.findMany();

  const statuses = ['Available', 'Unavailable', 'Lost', 'Damaged', 'Reserved', 'Borrowed', 'Distributed'];

  for (const item of inventoryItems) {
    // Generate a random number of stacks for each item (1 to 5 stacks)
    const numberOfStacks = Math.floor(Math.random() * 5) + 1;
    let remainingQuantity = faker.number.int({ min: 1, max: 50 }); // Random initial quantity

    for (let i = 0; i < numberOfStacks; i++) {
      // Determine the quantity for this stack (up to the remaining quantity)
      const stackQuantity = Math.min(faker.number.int({ min: 1, max: 20 }), remainingQuantity);
      remainingQuantity -= stackQuantity;

      // Randomly select a status for this stack
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      await prisma.itemStack.create({
        data: {
            itemId: item.id,
            quantity: stackQuantity,
            status: status,
        },
      });

        if (remainingQuantity <= 0) {
          break; // No more quantity to distribute
        }
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
    
    await createInventoryCategories();
    console.log('Inventory Categories created successfully.');
    
    await createInventoryItems();
    console.log('Inventory Items created successfully.');
    
    await createItemStacks();
    console.log('Inventory Item Stacks created successfully.');
  } 

  catch (error) {
    console.error('Error seeding data:', error);
  } 
  
  finally {
    await prisma.$disconnect();
  }
}

main();
