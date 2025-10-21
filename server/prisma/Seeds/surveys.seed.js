import { rnd, wait, randomDateBetweenDaysAgo, pick } from './util.js';

export async function seedSurveyForms(prisma) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  const forms = [];
  for (let i = 0; i < 5; i++) {
    const form = await prisma.surveyForm.create({ data: { title: rnd.lorem.words(4), description: rnd.lorem.sentence(), status: pick(['ACTIVE','DRAFT']), category: pick(['equipment','seminar','agriculture','feedback','general']), createdById: pick(admins).id, createdAt: randomDateBetweenDaysAgo(120, 0) } });
    for (let f = 0; f < rnd.number.int({min:5, max:8}); f++) {
      const fieldType = pick(['TEXT','EMAIL','NUMBER','RADIO','CHECKBOX','SELECT','DATE','TEXTAREA']);
      const needsOptions = ['RADIO','CHECKBOX','SELECT'].includes(fieldType);
      await prisma.surveyField.create({ data: { surveyFormId: form.id, type: fieldType, label: rnd.lorem.words(3), placeholder: '', required: Math.random() < 0.7, options: needsOptions ? JSON.stringify(['Option A','Option B','Option C','Option D']) : null, order: f+1 } });
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
        let answerValue;
        if (field.type === 'CHECKBOX') {
          // For checkbox, select 1-2 random options
          const opts = field.options ? JSON.parse(field.options) : ['Yes','No'];
          const selected = rnd.helpers.arrayElements(opts, rnd.number.int({min:1, max: Math.min(2, opts.length)}));
          answerValue = JSON.stringify(selected);
        } else if (field.type === 'RADIO' || field.type === 'SELECT') {
          // For radio/select, pick one option
          const opts = field.options ? JSON.parse(field.options) : ['Yes','No'];
          answerValue = JSON.stringify(pick(opts));
        } else if (field.type === 'NUMBER') {
          answerValue = JSON.stringify(rnd.number.int({min:1, max:100}));
        } else {
          // TEXT, EMAIL, TEXTAREA, DATE
          answerValue = JSON.stringify(rnd.lorem.words(3));
        }
        await prisma.surveyAnswer.create({ data: { responseId: resp.id, fieldId: field.id, answer: answerValue } });
      }
    }
  }
}

export async function seedSurveyStatistics(prisma) {
  const admins = await prisma.account.findMany({ where: { access: { in: ['Admin','Super_Admin'] } }, select: { id: true } });
  const forms = await prisma.surveyForm.findMany();
  for (let i = 0; i < 5; i++) {
    const config = {
      labels: ['A','B','C'],
      datasets: [{
        data: [rnd.number.int({min:10,max:90}), rnd.number.int({min:10,max:90}), rnd.number.int({min:10,max:90})]
      }]
    };
    await prisma.surveyStatistic.create({
      data: {
        surveyFormId: pick(forms).id,
        title: rnd.lorem.words(5),
        description: rnd.lorem.sentence(),
        chartType: pick(['PIE','BAR','LINE']),
        config: JSON.stringify(config),
        createdById: pick(admins).id,
        createdAt: randomDateBetweenDaysAgo(60, 0)
      }
    });
  }
}
