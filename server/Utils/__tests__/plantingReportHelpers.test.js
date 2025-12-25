import {
  calculateYield,
  calculateExpectedHarvest,
  validateStateTransitionData,
  updateStateHistory,
  buildReportQuery,
  getPaginationParams,
  daysUntilPermanentDelete
} from '../plantingReportHelpers.js';

console.log('\n=== Testing Auto-Calculation Helpers ===\n');

// Test yield calculation
const yieldResult = calculateYield(5.5, 350, 50, 'Rice');
console.log('Rice Yield Calculation:');
console.log(`  Area: 5.5 ha, Bags: 350, Weight: 50 kg`);
console.log(`  Yield: ${yieldResult.yield} Mt/Ha`);
console.log(`  Valid: ${yieldResult.valid}`);
console.log(`  Warning: ${yieldResult.warning || 'None'}\n`);

// Test invalid yield
const invalidYield = calculateYield(1, 1000, 50, 'Rice');
console.log('Invalid Rice Yield (50 Mt/Ha):');
console.log(`  Valid: ${invalidYield.valid}`);
console.log(`  Warning: ${invalidYield.warning}\n`);

console.log('=== Testing State Transition Validation ===\n');

// Test valid State 1→2 transition
const report1 = {
  state: 'Request_Report',
  typeOfCrop: 'Rice',
  areaPlanted: 6.0
};

const updateData1 = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanting',
  riceIrrigation: 'Irrigated'
};

const validation1 = validateStateTransitionData(report1, 'Planted', updateData1);
console.log('Valid Request→Planted:');
console.log(`  Valid: ${validation1.valid}`);
console.log(`  Errors: ${validation1.errors.join(', ') || 'None'}\n`);

// Test missing riceIrrigation
const updateData2 = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanting'
};

const validation2 = validateStateTransitionData(report1, 'Planted', updateData2);
console.log('Missing riceIrrigation:');
console.log(`  Valid: ${validation2.valid}`);
console.log(`  Errors: ${validation2.errors.join(', ')}\n`);

// Test State 2→3 transition
const report2 = {
  state: 'Planted',
  typeOfCrop: 'Rice',
  areaPlanted: 6.0
};

const updateData3 = {
  harvestArea: 5.5,
  numberOfBags: 100,
  weightPerBag: 50
};

const validation3 = validateStateTransitionData(report2, 'Completed', updateData3);
console.log('Valid Planted→Completed:');
console.log(`  Valid: ${validation3.valid}`);
console.log(`  Errors: ${validation3.errors.join(', ') || 'None'}\n`);

// Test invalid harvest area (> planted)
const updateData4 = {
  harvestArea: 7.0,
  numberOfBags: 100,
  weightPerBag: 50
};

const validation4 = validateStateTransitionData(report2, 'Completed', updateData4);
console.log('Invalid harvestArea > areaPlanted:');
console.log(`  Valid: ${validation4.valid}`);
console.log(`  Errors: ${validation4.errors.join(', ')}\n`);

console.log('=== Testing State History ===\n');

const history = updateStateHistory(
  [],
  'Request_Report',
  'Planted',
  'user-123',
  'Farmer confirmed planting'
);

console.log('State History Entry:');
console.log(JSON.stringify(history[0], null, 2));
console.log();

console.log('=== Testing Query Builder ===\n');

const query1 = buildReportQuery({
  state: 'Planted',
  typeOfCrop: 'Rice',
  isArchived: false
});

console.log('Query with state and crop filters:');
console.log(JSON.stringify(query1, null, 2));
console.log();

const query2 = buildReportQuery({
  search: 'Juan',
  distributionLinked: true
});

console.log('Query with search and distribution filter:');
console.log(JSON.stringify(query2, null, 2));
console.log();

console.log('=== Testing Pagination ===\n');

const paginationParams = getPaginationParams({ page: '2', limit: '50' });
console.log('Pagination params (page=2, limit=50):');
console.log(`  Page: ${paginationParams.page}`);
console.log(`  Limit: ${paginationParams.limit}`);
console.log(`  Skip: ${paginationParams.skip}\n`);

const paginationInvalid = getPaginationParams({ page: '-1', limit: '5' });
console.log('Pagination params with invalid values:');
console.log(`  Page: ${paginationInvalid.page} (should be 1)`);
console.log(`  Limit: ${paginationInvalid.limit} (should be 10)\n`);

console.log('=== Testing Date Helpers ===\n');

const recentDelete = new Date();
recentDelete.setDate(recentDelete.getDate() - 5);

const daysRemaining = daysUntilPermanentDelete(recentDelete);
console.log(`Days until permanent delete (deleted 5 days ago): ${daysRemaining} days\n`);

console.log('=== All Helper Tests Complete ===\n');
