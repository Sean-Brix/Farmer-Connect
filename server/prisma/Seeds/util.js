import { faker } from '@faker-js/faker';

export const wait = (ms) => new Promise((res) => setTimeout(res, ms));
export const rnd = faker;

export function randomDateBetweenDaysAgo(minDaysAgo = 365, maxDaysAgo = 0) {
  const now = new Date();
  const from = new Date(now.getTime() - Math.max(minDaysAgo, maxDaysAgo) * 24 * 60 * 60 * 1000);
  const to = new Date(now.getTime() - Math.min(minDaysAgo, maxDaysAgo) * 24 * 60 * 60 * 1000);
  return rnd.date.between({ from, to });
}

export function pick(arr) {
  return rnd.helpers.arrayElement(arr);
}
