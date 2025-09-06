import bcrypt from 'bcrypt';
import { rnd, wait, randomDateBetweenDaysAgo, pick } from './util.js';

export async function seedAccounts(prisma, { count = 150 } = {}) {
  const accessPool = ['User', 'User', 'User', 'Admin', 'Super_Admin'];
  const regions = ['Region IV-A', 'NCR', 'Region III', 'Region I', 'Region V'];
  for (let i = 0; i < count; i++) {
    const firstName = rnd.person.firstName();
    const lastName = rnd.person.lastName();
    const username = `${firstName}.${lastName}.${rnd.string.alphanumeric(3)}`.toLowerCase();
    const email = `${firstName}.${lastName}${rnd.number.int({min:100, max:999})}@example.com`.toLowerCase();
    const access = pick(accessPool);
    const createdAt = randomDateBetweenDaysAgo(720, 0);
    const password = await bcrypt.hash('123456', 10);
    try {
      await prisma.account.upsert({
        where: { username },
        update: {},
        create: {
          username,
          email,
          password,
          access,
          firstName,
          surname: lastName,
          sex: pick(['Male','Female','Other']),
          region: pick(regions),
          // Must match enums in prisma/schema/account.prisma
          client_profile: pick(['Fishfolk','Rural_Based_Org','Student','Youth','Women','Govt_Employee','PWD','Indigenous_People','Other']),
          education: pick(['No_formal_education','Elementary_graduate','High_school_graduate','Senior_high_school_graduate','College_graduate','Vocational_Technical']),
          createdAt,
        }
      });
    } catch {}
    if (i % 25 === 0) await wait(50);
  }
}
