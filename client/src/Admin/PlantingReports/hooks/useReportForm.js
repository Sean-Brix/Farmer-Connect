/**
 * useReportForm Hook
 * Form state management with validation
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { HIDDEN_FIELDS, LOCKED_FIELDS, PLANTING_STATES, REQUIRED_FIELDS } from '../constants/plantingReportConstants';
import { validateReportData } from '../validation/reportSchema';

export function useReportForm(initialData = null, currentState = PLANTING_STATES.PLANTING) {
	const [formData, setFormData] = useState(getInitialFormData(initialData));
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [isDirty, setIsDirty] = useState(false);

	useEffect(() => {
		if (initialData) {
			setFormData(getInitialFormData(initialData));
			setIsDirty(false);
		}
	}, [initialData, currentState]);

	const handleChange = useCallback(
		(field, value) => {
			setFormData((prev) => ({
				...prev,
				[field]: value
			}));
			setIsDirty(true);

			if (errors[field]) {
				setErrors((prev) => {
					const next = { ...prev };
					delete next[field];
					return next;
				});
			}
		},
		[errors]
	);

	const handleBlur = useCallback((field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true
		}));
	}, []);

	const validateForm = useCallback(() => {
		const validation = validateReportData(formData, currentState);

		if (validation.error) {
			const nextErrors = {};
			validation.error.details.forEach((detail) => {
				nextErrors[detail.path[0]] = detail.message;
			});
			setErrors(nextErrors);
			return false;
		}

		setErrors({});
		return true;
	}, [formData, currentState]);

	const validateField = useCallback(
		(field) => {
			const validation = validateReportData(formData, currentState);

			if (validation.error) {
				const fieldError = validation.error.details.find((detail) => detail.path[0] === field);
				if (fieldError) {
					setErrors((prev) => ({
						...prev,
						[field]: fieldError.message
					}));
					return false;
				}
			}

			setErrors((prev) => {
				if (!prev[field]) return prev;
				const next = { ...prev };
				delete next[field];
				return next;
			});
			return true;
		},
		[formData, currentState]
	);

	const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

	const isFieldRequired = useCallback((field) => REQUIRED_FIELDS[currentState]?.includes(field) || false, [currentState]);

	const isFieldLocked = useCallback((field) => LOCKED_FIELDS[currentState]?.includes(field) || false, [currentState]);

	const isFieldHidden = useCallback((field) => HIDDEN_FIELDS[currentState]?.includes(field) || false, [currentState]);

	const resetForm = useCallback(() => {
		setFormData(getInitialFormData(initialData));
		setErrors({});
		setTouched({});
		setIsDirty(false);
	}, [initialData]);

	const setFields = useCallback((fields) => {
		setFormData((prev) => ({
			...prev,
			...fields
		}));
		setIsDirty(true);
	}, []);

	return {
		formData,
		errors,
		touched,
		isDirty,
		handleChange,
		handleBlur,
		validateForm,
		validateField,
		isFieldRequired,
		isFieldLocked,
		isFieldHidden,
		resetForm,
		setFields,
		setFormData: setFields,
		isValid
	};
}

function getInitialFormData(data) {
	if (!data) {
		return {
			farmerName: '',
			farmLocation: '',
			rsbsaNumber: '',
			typeOfCrop: '',
			varietyId: '',
			croppingSeasonId: '',
			areaPlanted: '',
			seedClassification: '',
			cropInsurance: false,
			dateOfPlanting: null,
			plantingMethod: '',
			riceIrrigation: '',
			dateOfExpectedHarvest: null,
			harvestArea: '',
			numberOfBags: '',
			weightPerBag: '',
			yieldMtPerHa: ''
		};
	}

	return {
		farmerName: data.farmerName || '',
		farmLocation: data.farmLocation || '',
		rsbsaNumber: data.rsbsaNumber || '',
		typeOfCrop: data.typeOfCrop || '',
		varietyId: data.varietyId || '',
		croppingSeasonId: data.croppingSeasonId || '',
		areaPlanted: data.areaPlanted || '',
		seedClassification: data.seedClassification || '',
		cropInsurance: Boolean(data.cropInsurance),
		dateOfPlanting: data.dateOfPlanting || null,
		plantingMethod: data.plantingMethod || '',
		riceIrrigation: data.riceIrrigation || '',
		dateOfExpectedHarvest: data.dateOfExpectedHarvest || null,
		harvestArea: data.harvestArea || '',
		numberOfBags: data.numberOfBags || '',
		weightPerBag: data.weightPerBag || '',
		yieldMtPerHa: data.yieldMtPerHa || ''
	};
}

export default useReportForm;
