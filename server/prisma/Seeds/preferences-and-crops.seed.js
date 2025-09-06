import { rnd, pick, randomDateBetweenDaysAgo, wait } from './util.js';

export async function seedUserPreferences(prisma, { perUser = 3 } = {}) {
  const users = await prisma.account.findMany({ select: { id: true } });
  const keys = ['language', 'notifications_email', 'dark_mode', 'sms_alerts'];
  for (const u of users) {
    const n = rnd.number.int({ min: 1, max: perUser });
    const chosen = rnd.helpers.shuffle(keys).slice(0, n);
    await prisma.userPreference.createMany({
      data: chosen.map((k) => ({ userId: u.id, key: k, value: pick(['true', 'false', 'en', 'tl']) })),
      skipDuplicates: true,
    });
  }
}

export async function seedRegisteredCrops(prisma, { perUserMax = 3 } = {}) {
  const users = await prisma.account.findMany({ where: { access: 'User' }, select: { id: true } });
  const crops = ['Rice', 'Corn', 'Vegetables', 'Coconut', 'Banana', 'Coffee'];
  const varieties = ['IR64', 'Sweet Corn', 'Tomato', 'Eggplant', 'Robusta', 'Cavendish'];
  const statuses = ['Active', 'Inactive', 'Completed', 'Archived'];
  const stages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Harvested'];
  let created = 0;
  for (const u of users) {
    const n = rnd.number.int({ min: 0, max: perUserMax });
    for (let i = 0; i < n; i++) {
      const plant = randomDateBetweenDaysAgo(540, 120);
      const expectedHarvest = new Date(plant.getTime() + rnd.number.int({ min: 60, max: 180 }) * 24 * 60 * 60 * 1000);
      const crop = await prisma.registeredCrop.create({
        data: {
          userId: u.id,
          cropType: pick(crops),
          variety: pick(varieties),
          plantingDate: plant,
          expectedHarvest,
          area: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
          status: pick(statuses),
          currentStage: pick(stages),
          expectedYield: parseFloat((Math.random() * 500 + 50).toFixed(2)),
          notes: Math.random() < 0.3 ? rnd.lorem.sentence() : null,
          createdAt: randomDateBetweenDaysAgo(540, 0),
        },
      });
      created++;

      // monthly reports over lifetime
      const months = rnd.number.int({ min: 2, max: 8 });
      for (let m = 0; m < months; m++) {
        const reportDate = randomDateBetweenDaysAgo(360, 0);
        await prisma.cropMonthlyReport.create({
          data: {
            cropId: crop.id,
            reportDate,
            growthStage: pick(stages),
            plantHeight: parseFloat((Math.random() * 150).toFixed(1)),
            healthStatus: pick(['Good', 'Fair', 'Poor']),
            estimatedYield: parseFloat((Math.random() * 500 + 20).toFixed(2)),
            weatherImpact: pick(['None', 'Rain', 'Dry Spell', 'Storm']),
            notes: Math.random() < 0.4 ? rnd.lorem.sentence() : null,
            pestsObserved: Math.random() < 0.3 ? 'APHIDS' : null,
            diseasesObserved: Math.random() < 0.2 ? 'BLIGHT' : null,
            fertilizersApplied: Math.random() < 0.5 ? 'NPK' : null,
            pesticideApplications: Math.random() < 0.4 ? 'Pyrethroids' : null,
            irrigationFrequency: pick(['Daily','Weekly','Biweekly','None']),
            soilCondition: pick(['Loam','Clay','Sandy']),
            majorActivities: pick(['Weeding','Fertilizing','Irrigation','Harvest Planning']),
            challenges: Math.random() < 0.3 ? 'Labor shortage' : null,
            plannedActions: Math.random() < 0.3 ? 'Apply bio-fertilizer' : null,
            actualYield: Math.random() < 0.2 ? parseFloat((Math.random() * 500).toFixed(2)) : null,
            costs: { seeds: Math.random() * 1000, labor: Math.random() * 3000 },
            weatherSnapshot: { temp: 30 + Math.random() * 5, humidity: 60 + Math.random() * 20 },
            createdAt: randomDateBetweenDaysAgo(360, 0),
          },
        });
      }
      if (created % 20 === 0) await wait(10);
    }
  }
}
