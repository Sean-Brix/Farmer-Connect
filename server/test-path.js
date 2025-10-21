import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('__dirname:', __dirname);
console.log('Expected path:', join(__dirname, '../../../client/src/data/cropGuidelinesData.json'));

try {
  const data = readFileSync(join(__dirname, '../../../client/src/data/cropGuidelinesData.json'), 'utf-8');
  const json = JSON.parse(data);
  console.log('JSON loaded successfully!');
  console.log('Number of crops:', json.crops?.length);
} catch (error) {
  console.error('Error loading JSON:', error.message);
}
