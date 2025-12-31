import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const cookie = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWprZHR4ZmowMDAwdHVzazB3Y3IxcHFrIiwiaWF0IjoxNzY2NjA2Nzg3LCJleHAiOjE3NjY4NjU5ODd9.osoeQsP81PwHO3uW0A1H6iNwhKoB5cGPqfNgOAKgntc';
const userId = 'cmjkdtxfj0000tusk0wcr1pqk';
const base = 'http://127.0.0.1:8080/api/planting-reports';
const headers = {
  'Content-Type': 'application/json',
  Cookie: cookie
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchIds() {
  // Use seedVariety and plantingSeason models from Prisma client
  const variety = await prisma.seedVariety.findFirst();
  const season = await prisma.plantingSeason.findFirst();
  return { varietyId: variety?.id, seasonId: season?.id };
}

async function createReport(label, varietyId, seasonId) {
  const body = {
    farmerName: `Test ${label}`,
    farmLocation: 'Test Farm',
    areaPlanted: 2.1,
    typeOfCrop: 'Rice',
    seedClassification: 'Inbred_Certified',
    varietyId,
    croppingSeasonId: seasonId
  };

  const res = await fetch(`${base}/reports`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const text = await res.text();
  console.log('CREATE', label, 'status', res.status, 'body', text);
  if (!res.ok) throw new Error('create failed');
  const data = JSON.parse(text);
  return data.data.id;
}

async function transitionPlanted(id) {
  const body = {
    dateOfPlanting: '2025-01-10',
    plantingMethod: 'Direct_Seeded',
    riceIrrigation: 'Irrigated'
  };
  const res = await fetch(`${base}/reports/${id}/transition/planted`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body)
  });
  const text = await res.text();
  console.log('PLANTED status', res.status, 'body', text);
  if (!res.ok) throw new Error('planted failed');
}

async function transitionCompleted(id) {
  const body = {
    harvestArea: 1.5,
    numberOfBags: 120,
    weightPerBag: 50
  };
  const res = await fetch(`${base}/reports/${id}/transition/completed`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body)
  });
  const text = await res.text();
  console.log('COMPLETED status', res.status, 'body', text);
  if (!res.ok) throw new Error('completed failed');
}

async function archiveReport(id) {
  const body = {
    
  };
  const res = await fetch(`${base}/reports/${id}/archive`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body)
  });
  const text = await res.text();
  console.log('ARCHIVE status', res.status, 'body', text);
  if (!res.ok) throw new Error('archive failed');
}

async function bulkArchive(ids) {
  const body = {
    reportIds: ids
  };
  const res = await fetch(`${base}/reports/bulk/archive`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const text = await res.text();
  console.log('BULK ARCHIVE status', res.status, 'body', text);
  if (!res.ok) throw new Error('bulk archive failed');
}

async function bulkDelete(ids) {
  const body = {
    reportIds: ids
  };
  const res = await fetch(`${base}/reports/bulk/delete`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const text = await res.text();
  console.log('BULK DELETE status', res.status, 'body', text);
  if (!res.ok) throw new Error('bulk delete failed');
}

async function main() {
  const { varietyId, seasonId } = await fetchIds();
  if (!varietyId) {
    console.error('No variety found');
    return;
  }

  const reportId = await createReport('Main', varietyId, seasonId);
  await sleep(200);
  await transitionPlanted(reportId);
  await sleep(200);
  await transitionCompleted(reportId);
  await sleep(200);
  await archiveReport(reportId);

  const b1 = await createReport('Bulk1', varietyId, seasonId);
  const b2 = await createReport('Bulk2', varietyId, seasonId);
  await sleep(100);
  await transitionPlanted(b1);
  await sleep(100);
  await transitionCompleted(b1);
  await sleep(100);
  await transitionPlanted(b2);
  await sleep(100);
  await transitionCompleted(b2);
  await sleep(200);
  await bulkArchive([b1, b2]);
  await sleep(200);
  await bulkDelete([b1, b2]);
}

main()
  .catch((err) => {
    console.error('TEST ERROR', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
