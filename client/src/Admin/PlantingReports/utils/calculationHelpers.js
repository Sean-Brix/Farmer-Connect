/**
 * Calculation Helper Utilities
 * Auto-calculations for yield and expected harvest
 */

import { calculateHarvestDate } from './dateHelpers';

export function calculateYield(harvestArea, numberOfBags, weightPerBag) {
	if (!harvestArea || !numberOfBags || !weightPerBag) {
		return null;
	}

	if (harvestArea <= 0 || numberOfBags <= 0 || weightPerBag <= 0) {
		return null;
	}

	try {
		const totalWeightKg = numberOfBags * weightPerBag;
		const totalWeightMT = totalWeightKg / 1000;
		const yieldMtPerHa = totalWeightMT / harvestArea;

		return Math.round(yieldMtPerHa * 100) / 100;
	} catch (error) {
		console.error('Yield calculation error:', error);
		return null;
	}
}

export function calculateExpectedHarvest(dateOfPlanting, typeOfCrop) {
	return calculateHarvestDate(dateOfPlanting, typeOfCrop);
}

export function calculateTotalProduction(numberOfBags, weightPerBag) {
	if (!numberOfBags || !weightPerBag) {
		return null;
	}

	try {
		const totalWeightKg = numberOfBags * weightPerBag;
		const totalWeightMT = totalWeightKg / 1000;

		return Math.round(totalWeightMT * 100) / 100;
	} catch (error) {
		console.error('Total production calculation error:', error);
		return null;
	}
}

export function validateHarvestArea(harvestArea, areaPlanted) {
	if (!harvestArea || !areaPlanted) {
		return false;
	}

	return harvestArea <= areaPlanted;
}

export function calculateHarvestPercentage(harvestArea, areaPlanted) {
	if (!harvestArea || !areaPlanted || areaPlanted === 0) {
		return 0;
	}

	return Math.round((harvestArea / areaPlanted) * 100);
}

export default {
	calculateYield,
	calculateExpectedHarvest,
	calculateTotalProduction,
	validateHarvestArea,
	calculateHarvestPercentage
};
