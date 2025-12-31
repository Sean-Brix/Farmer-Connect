/**
 * State Transition Validation Rules
 * Validation for state transitions
 */

import Joi from 'joi';
import { CROP_TYPE_VALUES, PLANTING_METHODS, PLANTING_STATES, RICE_IRRIGATION_TYPES } from '../constants/plantingReportConstants';

export const toPlantedSchema = Joi.object({
	dateOfPlanting: Joi.date()
		.max('now')
		.required()
		.messages({
			'date.base': 'Date of planting must be a valid date',
			'date.max': 'Date of planting cannot be in the future',
			'any.required': 'Date of planting is required to transition to Planted'
		}),
	plantingMethod: Joi.string()
		.valid(...PLANTING_METHODS)
		.required()
		.messages({
			'any.only': 'Planting method must be Direct Seeding or Transplanting',
			'any.required': 'Planting method is required to transition to Planted'
		}),
	riceIrrigation: Joi.when('typeOfCrop', {
		is: 'Rice',
		then: Joi.string()
			.valid(...RICE_IRRIGATION_TYPES)
			.required()
			.messages({
				'any.only': 'Rice irrigation must be Irrigated, Rainfed, or Upland',
				'any.required': 'Rice irrigation is required for Rice crops'
			}),
		otherwise: Joi.optional().allow(null, '')
	}),
	typeOfCrop: Joi.string()
		.valid(...CROP_TYPE_VALUES)
		.required()
}).options({ allowUnknown: true });

export const toCompletedSchema = Joi.object({
	harvestArea: Joi.number()
		.positive()
		.max(Joi.ref('areaPlanted'))
		.required()
		.messages({
			'number.base': 'Harvest area must be a number',
			'number.positive': 'Harvest area must be positive',
			'number.max': 'Harvest area cannot exceed planted area',
			'any.required': 'Harvest area is required to transition to Completed'
		}),
	numberOfBags: Joi.number()
		.integer()
		.positive()
		.required()
		.messages({
			'number.base': 'Number of bags must be a number',
			'number.integer': 'Number of bags must be a whole number',
			'number.positive': 'Number of bags must be positive',
			'any.required': 'Number of bags is required to transition to Completed'
		}),
	weightPerBag: Joi.number()
		.positive()
		.max(1000)
		.required()
		.messages({
			'number.base': 'Weight per bag must be a number',
			'number.positive': 'Weight per bag must be positive',
			'number.max': 'Weight per bag cannot exceed 1000 kg',
			'any.required': 'Weight per bag is required to transition to Completed'
		}),
	areaPlanted: Joi.number()
		.positive()
		.required()
}).options({ allowUnknown: true });

export function validateStateTransition(targetState, data) {
	switch (targetState) {
		case PLANTING_STATES.PLANTED:
			return toPlantedSchema.validate(data, { abortEarly: false });
		case PLANTING_STATES.HARVESTED:
			return toCompletedSchema.validate(data, { abortEarly: false });
		default:
			return {
				error: {
					details: [{ message: `Invalid target state: ${targetState}` }]
				}
			};
	}
}

export function isValidTransition(currentState, targetState) {
	const validTransitions = {
		[PLANTING_STATES.PLANTING]: [PLANTING_STATES.PLANTED],
		[PLANTING_STATES.PLANTED]: [PLANTING_STATES.HARVESTED],
		[PLANTING_STATES.HARVESTED]: []
	};

	return (validTransitions[currentState] || []).includes(targetState);
}

export default {
	toPlantedSchema,
	toCompletedSchema,
	validateStateTransition,
	isValidTransition
};
