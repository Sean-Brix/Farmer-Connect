import {
  toPlantedSchema,
  toCompletedSchema,
  createReportSchema,
  validateYieldSanity,
  validateHarvestArea,
  validateStateTransition
} from '../plantingReportValidation.js';

// Test State 1 → 2 transition
console.log('\n=== Testing State 1→2 Transition ===\n');

const validPlantedData = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanting',
  typeOfCrop: 'Rice',
  riceIrrigation: 'Irrigated'
};

const result1 = toPlantedSchema.validate(validPlantedData, {
  context: { typeOfCrop: 'Rice' }
});
console.log('Valid data:', result1.error ? 'FAILED' : 'PASSED');
if (result1.error) console.error(result1.error.details);

// Missing riceIrrigation for Rice
const invalidPlantedData = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanting',
  typeOfCrop: 'Rice'
};

const result2 = toPlantedSchema.validate(invalidPlantedData, {
  context: { typeOfCrop: 'Rice' }
});
console.log('Missing riceIrrigation:', result2.error ? 'PASSED (correctly rejected)' : 'FAILED');
if (result2.error) console.log('Error:', result2.error.details[0].message);

// Test State 2 → 3 transition
console.log('\n=== Testing State 2→3 Transition ===\n');

const validCompletedData = {
  harvestArea: 5.5,
  numberOfBags: 100,
  weightPerBag: 50
};

const result3 = toCompletedSchema.validate(validCompletedData, {
  context: { areaPlanted: 6.0 }
});
console.log('Valid harvest data:', result3.error ? 'FAILED' : 'PASSED');

// harvestArea > areaPlanted
const invalidCompletedData = {
  harvestArea: 7.0,
  numberOfBags: 100,
  weightPerBag: 50
};

const result4 = toCompletedSchema.validate(invalidCompletedData, {
  context: { areaPlanted: 6.0 }
});
console.log('Harvest > Planted:', result4.error ? 'PASSED (correctly rejected)' : 'FAILED');
if (result4.error) console.log('Error:', result4.error.details[0].message);

// Test yield sanity check
console.log('\n=== Testing Yield Sanity Checks ===\n');

const riceYieldNormal = validateYieldSanity('Rice', 5.5);
console.log('Rice 5.5 Mt/Ha:', riceYieldNormal.valid ? 'PASSED' : 'FAILED', riceYieldNormal.warning || '');

const riceYieldHigh = validateYieldSanity('Rice', 15.0);
console.log('Rice 15.0 Mt/Ha:', riceYieldHigh.valid ? 'FAILED (should reject)' : 'PASSED (correctly rejected)', riceYieldHigh.warning || '');

const cornYieldNormal = validateYieldSanity('Corn', 7.0);
console.log('Corn 7.0 Mt/Ha:', cornYieldNormal.valid ? 'PASSED' : 'FAILED', cornYieldNormal.warning || '');

// Test harvest area validation
console.log('\n=== Testing Harvest Area Validation ===\n');

const harvestValid = validateHarvestArea(6.0, 5.5);
console.log('Harvest 5.5 / Planted 6.0:', harvestValid.valid ? 'PASSED' : 'FAILED');

const harvestInvalid = validateHarvestArea(6.0, 7.0);
console.log('Harvest 7.0 / Planted 6.0:', harvestInvalid.valid ? 'FAILED' : 'PASSED (correctly rejected)');
console.log('Error:', harvestInvalid.error);

// Test state transition validation
console.log('\n=== Testing State Transition Logic ===\n');

const trans1 = validateStateTransition('Request_Report', 'Planted');
console.log('Request→Planted:', trans1.valid ? 'PASSED' : 'FAILED');

const trans2 = validateStateTransition('Planted', 'Completed');
console.log('Planted→Completed:', trans2.valid ? 'PASSED' : 'FAILED');

const trans3 = validateStateTransition('Request_Report', 'Completed');
console.log('Request→Completed (skip):', trans3.valid ? 'FAILED' : 'PASSED (correctly rejected)');
console.log('Error:', trans3.error);

const trans4 = validateStateTransition('Completed', 'Planted');
console.log('Completed→Planted (backward):', trans4.valid ? 'FAILED' : 'PASSED (correctly rejected)');
console.log('Error:', trans4.error);

console.log('\n=== All Tests Complete ===\n');
