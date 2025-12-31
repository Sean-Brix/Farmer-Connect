/**
 * Bulk Operation Validation Schema
 * Validation for bulk archive and delete operations
 */

import Joi from 'joi';

export const bulkArchiveSchema = Joi.object({
	ids: Joi.array()
		.items(Joi.number().integer().positive())
		.min(1)
		.max(100)
		.required()
		.messages({
			'array.base': 'IDs must be an array',
			'array.min': 'At least one report must be selected',
			'array.max': 'Cannot archive more than 100 reports at once',
			'any.required': 'Report IDs are required'
		})
});

export const bulkDeleteSchema = Joi.object({
	ids: Joi.array()
		.items(Joi.number().integer().positive())
		.min(1)
		.max(100)
		.required()
		.messages({
			'array.base': 'IDs must be an array',
			'array.min': 'At least one report must be selected',
			'array.max': 'Cannot delete more than 100 reports at once',
			'any.required': 'Report IDs are required'
		})
});

export function validateBulkArchive(ids) {
	return bulkArchiveSchema.validate({ ids });
}

export function validateBulkDelete(ids) {
	return bulkDeleteSchema.validate({ ids });
}

export default {
	bulkArchiveSchema,
	bulkDeleteSchema,
	validateBulkArchive,
	validateBulkDelete
};
