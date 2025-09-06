import { rnd, wait, randomDateBetweenDaysAgo, pick } from './util.js';

export async function seedSurveyForms(prisma) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  const forms = [];
  for (let i = 0; i < 5; i++) {
    const form = await prisma.surveyForm.create({ data: { title: rnd.lorem.words(4), description: rnd.lorem.sentence(), status: pick(['ACTIVE','DRAFT']), category: pick(['equipment','seminar','agriculture','feedback','general']), createdById: pick(admins).id, createdAt: randomDateBetweenDaysAgo(120, 0) } });
    for (let f = 0; f < rnd.number.int({min:5, max:8}); f++) {
      await prisma.surveyField.create({ data: { surveyFormId: form.id, type: pick(['TEXT','EMAIL','NUMBER','RADIO','CHECKBOX','SELECT','DATE','TEXTAREA']), label: rnd.lorem.words(3), placeholder: '', required: Math.random() < 0.7, options: ['A','B','C','D'], order: f+1 } });
    }
    forms.push(form);
  }
  return forms;
}

export async function seedSurveyResponses(prisma) {
  const forms = await prisma.surveyForm.findMany({ include: { fields: true } });
  const users = await prisma.account.findMany({ where: { access: 'User' }, select: { id: true } });
  for (const form of forms) {
    const responses = rnd.number.int({min: 20, max: 80});
    for (let i = 0; i < responses; i++) {
      const resp = await prisma.surveyResponse.create({ data: { surveyFormId: form.id, userId: pick(users).id, submittedAt: randomDateBetweenDaysAgo(120, 0) } });
      for (const field of form.fields) {
        await prisma.surveyAnswer.create({ data: { responseId: resp.id, fieldId: field.id, answer: rnd.lorem.words(3) } });
      }
    }
  }
}

export async function seedSurveyStatistics(prisma) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  const forms = await prisma.surveyForm.findMany();
  for (let i = 0; i < 5; i++) {
    await prisma.surveyStatistic.create({ data: { surveyFormId: pick(forms).id, title: rnd.lorem.words(5), description: rnd.lorem.sentence(), chartType: pick(['PIE','BAR','LINE']), config: { labels: ['A','B','C'], datasets: [{ data: [rnd.number.int({min:10,max:90}), rnd.number.int({min:10,max:90}), rnd.number.int({min:10,max:90})]}]}, createdById: pick(admins).id, createdAt: randomDateBetweenDaysAgo(60, 0) } });
  }
}
