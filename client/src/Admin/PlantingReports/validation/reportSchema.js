/**
 * Report Validation Schemas
 * Joi schemas for form validation
 */

import Joi from 'joi';
import {
	CROP_TYPE_VALUES,
	PLANTING_METHODS,
	PLANTING_STATES,
	RICE_IRRIGATION_TYPES,
	SEED_CLASSIFICATIONS
} from '../constants/plantingReportConstants';

const farmerNameSchema = Joi.string()
	.min(2)
	.max(100)
	.required()
	.messages({
		'string.empty': 'Farmer name is required',
		'string.min': 'Farmer name must be at least 2 characters',
		'string.max': 'Farmer name cannot exceed 100 characters'
	});

const farmLocationSchema = Joi.string()
	.min(2)
	.max(200)
	.required()
	.messages({
		'string.empty': 'Farm location is required',
		'string.min': 'Farm location must be at least 2 characters',
		'string.max': 'Farm location cannot exceed 200 characters'
	});

const rsbsaNumberSchema = Joi.string()
	.optional()
	.allow('', null)
	.pattern(/^(RSBSA-)?\d{2}-\d{3}-\d{4}-\d{5}$/)
	.messages({
		'string.pattern.base': 'RSBSA number must be in format: RSBSA-XX-XXX-XXXX-XXXXX or XX-XXX-XXXX-XXXXX'
	});

const typeOfCropSchema = Joi.string()
	.valid(...CROP_TYPE_VALUES)
	.required()
	.messages({
		'any.only': 'Crop type must be Rice, Corn, or High-Value',
		'any.required': 'Crop type is required'
	});

const varietyIdSchema = Joi.alternatives()
	.try(
		Joi.number().integer().positive(),
		Joi.string().min(1)
	)
	.required()
	.messages({
		'alternatives.match': 'Variety is required',
		'any.required': 'Variety is required'
	});

const croppingSeasonIdSchema = Joi.alternatives()
	.try(
		Joi.number().integer().positive(),
		Joi.string().min(1)
	)
	.optional()
	.allow(null, '');

const areaPlantedSchema = Joi.number()
	.positive()
	.max(10000)
	.required()
	.messages({
		'number.base': 'Area planted must be a number',
		'number.positive': 'Area planted must be positive',
		'number.max': 'Area planted cannot exceed 10,000 hectares',
		'any.required': 'Area planted is required'
	});

const seedClassificationSchema = Joi.string()
	.valid(...SEED_CLASSIFICATIONS.map(s => s.value))
	.required()
	.messages({
		'any.only': 'Invalid seed classification',
		'any.required': 'Seed classification is required'
	});

const cropInsuranceSchema = Joi.boolean().optional().default(false);

const dateOfPlantingSchema = Joi.date()
	.max('now')
	.required()
	.messages({
		'date.base': 'Date of planting must be a valid date',
		'date.max': 'Date of planting cannot be in the future',
		'any.required': 'Date of planting is required'
	});

const plantingMethodSchema = Joi.string()
	.valid(...PLANTING_METHODS)
	.required()
	.messages({
		'any.only': 'Planting method must be Direct Seeding or Transplanting',
		'any.required': 'Planting method is required'
	});

const riceIrrigationSchema = Joi.string()
	.valid(...RICE_IRRIGATION_TYPES)
	.messages({
		'any.only': 'Rice irrigation must be Irrigated, Rainfed, or Upland'
	});

const harvestAreaSchema = Joi.number()
	.positive()
	.max(Joi.ref('areaPlanted'))
	.required()
	.messages({
		'number.base': 'Harvest area must be a number',
		'number.positive': 'Harvest area must be positive',
		'number.max': 'Harvest area cannot exceed planted area',
		'any.required': 'Harvest area is required'
	});

const numberOfBagsSchema = Joi.number()
	.integer()
	.positive()
	.required()
	.messages({
		'number.base': 'Number of bags must be a number',
		'number.integer': 'Number of bags must be a whole number',
		'number.positive': 'Number of bags must be positive',
		'any.required': 'Number of bags is required'
	});

const weightPerBagSchema = Joi.number()
	.positive()
	.max(1000)
	.required()
	.messages({
		'number.base': 'Weight per bag must be a number',
		'number.positive': 'Weight per bag must be positive',
		'number.max': 'Weight per bag cannot exceed 1000 kg',
		'any.required': 'Weight per bag is required'
	});

export const requestReportSchema = Joi.object({
	farmerName: farmerNameSchema,
	farmLocation: farmLocationSchema,
	rsbsaNumber: rsbsaNumberSchema,
	typeOfCrop: typeOfCropSchema,
	varietyId: varietyIdSchema,
	croppingSeasonId: croppingSeasonIdSchema,
	areaPlanted: areaPlantedSchema,
	seedClassification: seedClassificationSchema,
	cropInsurance: cropInsuranceSchema,
	dateOfPlanting: Joi.date().optional().allow(null, ''),
	plantingMethod: Joi.string().valid(...PLANTING_METHODS, null, '').optional(),
	riceIrrigation: Joi.string().valid(...RICE_IRRIGATION_TYPES, null, '').optional(),
	dateOfExpectedHarvest: Joi.date().optional().allow(null, ''),
	harvestArea: Joi.any().optional().allow(null, ''),
	numberOfBags: Joi.any().optional().allow(null, ''),
	weightPerBag: Joi.any().optional().allow(null, ''),
	yieldMtPerHa: Joi.any().optional().allow(null, '')
}).options({ allowUnknown: true }).custom((value, helpers) => {
	// Conditional validation: if ANY planting field is filled, ALL planting fields required
	const hasDateOfPlanting = value.dateOfPlanting && value.dateOfPlanting !== '';
	const hasPlantingMethod = value.plantingMethod && value.plantingMethod !== '';
	const hasRiceIrrigation = value.riceIrrigation && value.riceIrrigation !== '';
	
	const hasAnyPlanting = hasDateOfPlanting || hasPlantingMethod || hasRiceIrrigation;
	
	if (hasAnyPlanting) {
		// If any planting field is filled, require date and method
		if (!hasDateOfPlanting) {
			return helpers.message('Date of planting is required when filling planting details');
		}
		if (!hasPlantingMethod) {
			return helpers.message('Planting method is required when filling planting details');
		}
		// If crop is Rice, require irrigation
		if (value.typeOfCrop === 'Rice' && !hasRiceIrrigation) {
			return helpers.message('Rice irrigation is required for Rice crops when filling planting details');
		}
	}
	
	return value;
});

export const plantedReportSchema = Joi.object({
	farmerName: farmerNameSchema,
	farmLocation: farmLocationSchema,
	rsbsaNumber: rsbsaNumberSchema,
	typeOfCrop: typeOfCropSchema,
	varietyId: varietyIdSchema,
	croppingSeasonId: croppingSeasonIdSchema,
	areaPlanted: areaPlantedSchema,
	seedClassification: seedClassificationSchema,
	cropInsurance: cropInsuranceSchema,
	dateOfPlanting: dateOfPlantingSchema,
	plantingMethod: plantingMethodSchema,
	riceIrrigation: Joi.when('typeOfCrop', {
		is: 'Rice',
		then: riceIrrigationSchema.required(),
		otherwise: Joi.optional().allow(null, '')
	}),
	dateOfExpectedHarvest: Joi.date().optional().allow(null),
	harvestArea: Joi.number()
		.positive()
		.max(Joi.ref('areaPlanted'))
		.optional()
		.allow(null, '')
		.messages({
			'number.base': 'Harvest area must be a number',
			'number.positive': 'Harvest area must be positive',
			'number.max': 'Harvest area cannot exceed planted area'
		}),
	numberOfBags: Joi.number()
		.integer()
		.positive()
		.optional()
		.allow(null, '')
		.messages({
			'number.base': 'Number of bags must be a number',
			'number.integer': 'Number of bags must be a whole number',
			'number.positive': 'Number of bags must be positive'
		}),
	weightPerBag: Joi.number()
		.positive()
		.max(1000)
		.optional()
		.allow(null, '')
		.messages({
			'number.base': 'Weight per bag must be a number',
			'number.positive': 'Weight per bag must be positive',
			'number.max': 'Weight per bag cannot exceed 1000 kg'
		}),
	yieldMtPerHa: Joi.number()
		.positive()
		.optional()
		.allow(null, '')
		.messages({
			'number.base': 'Yield must be a number',
			'number.positive': 'Yield must be positive'
		})
}).options({ allowUnknown: true }).custom((value, helpers) => {
	// Conditional validation: if ANY harvest field is filled, ALL harvest fields required
	const hasHarvestArea = value.harvestArea && value.harvestArea !== '' && value.harvestArea !== null;
	const hasNumberOfBags = value.numberOfBags && value.numberOfBags !== '' && value.numberOfBags !== null;
	const hasWeightPerBag = value.weightPerBag && value.weightPerBag !== '' && value.weightPerBag !== null;
	
	const hasAnyHarvest = hasHarvestArea || hasNumberOfBags || hasWeightPerBag;
	
	if (hasAnyHarvest) {
		// If any harvest field is filled, require all
		if (!hasHarvestArea) {
			return helpers.message('Harvest area is required when filling harvest details');
		}
		if (!hasNumberOfBags) {
			return helpers.message('Number of bags is required when filling harvest details');
		}
		if (!hasWeightPerBag) {
			return helpers.message('Weight per bag is required when filling harvest details');
		}
	}
	
	return value;
});

export const completedReportSchema = Joi.object({
	farmerName: farmerNameSchema,
	farmLocation: farmLocationSchema,
	rsbsaNumber: rsbsaNumberSchema,
	typeOfCrop: typeOfCropSchema,
	varietyId: varietyIdSchema,
	croppingSeasonId: croppingSeasonIdSchema,
	areaPlanted: areaPlantedSchema,
	seedClassification: seedClassificationSchema,
	cropInsurance: cropInsuranceSchema,
	dateOfPlanting: dateOfPlantingSchema,
	plantingMethod: plantingMethodSchema,
	riceIrrigation: Joi.when('typeOfCrop', {
		is: 'Rice',
		then: riceIrrigationSchema.required(),
		otherwise: Joi.optional().allow(null, '')
	}),
	dateOfExpectedHarvest: Joi.date().optional().allow(null),
	harvestArea: harvestAreaSchema,
	numberOfBags: numberOfBagsSchema,
	weightPerBag: weightPerBagSchema,
	yieldMtPerHa: Joi.number().optional().allow(null, '')
}).options({ allowUnknown: true });

export const FIELD_SCHEMAS = {
	farmerName: farmerNameSchema,
	farmLocation: farmLocationSchema,
	rsbsaNumber: rsbsaNumberSchema,
	typeOfCrop: typeOfCropSchema,
	varietyId: varietyIdSchema,
	croppingSeasonId: croppingSeasonIdSchema,
	areaPlanted: areaPlantedSchema,
	seedClassification: seedClassificationSchema,
	cropInsurance: cropInsuranceSchema,
	dateOfPlanting: dateOfPlantingSchema,
	plantingMethod: plantingMethodSchema,
	riceIrrigation: riceIrrigationSchema,
	dateOfExpectedHarvest: Joi.date().optional().allow(null),
	harvestArea: harvestAreaSchema,
	numberOfBags: numberOfBagsSchema,
	weightPerBag: weightPerBagSchema,
	yieldMtPerHa: Joi.number().optional().allow(null, '')
};

export function validateReportData(data, state) {
	switch (state) {
		case PLANTING_STATES.PLANTING:
			// Planting state uses requestReportSchema (basic info + optional planting details)
			return requestReportSchema.validate(data, { abortEarly: false });
		case PLANTING_STATES.PLANTED:
			// Planted state requires planting data
			return plantedReportSchema.validate(data, { abortEarly: false });
		case PLANTING_STATES.HARVESTED:
			// Harvested state requires harvest data
			return completedReportSchema.validate(data, { abortEarly: false });
		default:
			// Return a proper Joi-like error structure for unknown states
			return { 
				error: { 
					details: [{ 
						message: `Invalid state: ${state}`,
						path: ['state'],
						type: 'any.invalid'
					}]
				}
			};
	}
}

export default {
	requestReportSchema,
	plantedReportSchema,
	completedReportSchema,
	validateReportData,
	FIELD_SCHEMAS
};
