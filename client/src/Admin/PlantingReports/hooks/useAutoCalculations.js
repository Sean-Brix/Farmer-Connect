/**
 * useAutoCalculations Hook
 * Auto-calculate yield and expected harvest date
 */

import { useEffect } from 'react';
import { calculateExpectedHarvest, calculateYield } from '../utils/calculationHelpers';

export function useAutoCalculations(formData, setFields) {
	useEffect(() => {
		const { harvestArea, numberOfBags, weightPerBag } = formData;

		if (harvestArea && numberOfBags && weightPerBag) {
			const calculatedYield = calculateYield(harvestArea, numberOfBags, weightPerBag);

			if (calculatedYield !== formData.yieldMtPerHa) {
				setFields({ yieldMtPerHa: calculatedYield });
			}
		}
	}, [formData.harvestArea, formData.numberOfBags, formData.weightPerBag, formData.yieldMtPerHa, setFields]);

	useEffect(() => {
		const { dateOfPlanting, typeOfCrop } = formData;

		if (dateOfPlanting && typeOfCrop) {
			const calculatedDate = calculateExpectedHarvest(dateOfPlanting, typeOfCrop);

			if (calculatedDate !== formData.dateOfExpectedHarvest) {
				setFields({ dateOfExpectedHarvest: calculatedDate });
			}
		}
	}, [formData.dateOfPlanting, formData.typeOfCrop, formData.dateOfExpectedHarvest, setFields]);

	return null;
}

export default useAutoCalculations;
