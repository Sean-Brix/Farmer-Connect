import { PrismaClient } from './schema/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

//? ========================================= ACCOUNT ========================================= ?//

import users from './Data/account.json' with { type: 'json' }

async function createAccount() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash("123456", 10)

    await prisma.accounts.create({
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
    await prisma.commodities.create({
        data: {
            name: commodity.name,
            description: commodity.description,
        },
    });
    }
}

//? ==================================== ACCOUNT COMMODITIES =================================== ?//

async function createAccountCommodities() {
  const accountsData = await prisma.accounts.findMany();
  const commoditiesData = await prisma.commodities.findMany();

  for (const account of accountsData) {
    for (const commodity of commoditiesData) {
      await prisma.accounts_commodities.create({
        data: {
          account_id: account.id,
          commodity_id: commodity.id,
        },
      });
    }
  }
}

//? ======================================== SEMINARS ======================================== ?//

import seminarsData from './Data/seminars.json' with { type: 'json' }
async function createSeminars() {
  for (const seminar of seminarsData) {
    await prisma.seminars.create({
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
    const seminars = await prisma.seminars.findMany();
    const accounts = await prisma.accounts.findMany();

    for (const seminar of seminars) {
        for (const account of accounts) {
            await prisma.seminar_participants.create({
                data: {
                    seminar_id: seminar.id,
                    account_id: account.id,
                },
            });
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
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
