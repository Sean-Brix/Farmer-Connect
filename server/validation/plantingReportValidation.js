import Joi from 'joi';

// ==================== ENUMS ====================
const CropTypes = ['Rice', 'Corn', 'High_Value_Crops'];
const PlantingMethods = ['Transplanting', 'Direct_Seeded'];
const RiceIrrigationTypes = ['Irrigated', 'RainfedLowland'];
const SeedClassifications = [
  'Inbred_Certified',
  'Hybrid_F1',
  'Inbred_Good',
  "Inbred_Farmers"
];
const PlantingReportStates = ['Request_Report', 'Planted', 'Completed'];

// ==================== BASE FIELDS ====================
const farmerInfoFields = {
  farmerName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Farmer name is required',
      'string.min': 'Farmer name must be at least 2 characters',
      'string.max': 'Farmer name cannot exceed 100 characters'
    }),
  farmLocation: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Farm location is required',
      'string.min': 'Farm location must be at least 2 characters',
      'string.max': 'Farm location cannot exceed 200 characters'
    }),
  rsbsaNumber: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9-]+$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'RSBSA number must contain only letters, numbers, and hyphens'
    })
};

const seedingDetailsFields = {
  typeOfCrop: Joi.string()
    .valid(...CropTypes)
    .required()
    .messages({
      'any.only': 'Type of crop must be Rice, Corn, or High_Value_Crops',
      'any.required': 'Type of crop is required'
    }),
  varietyId: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Seed variety is required'
    }),
  croppingSeasonId: Joi.string()
    .trim()
    .allow(null)
    .optional(),
  areaPlanted: Joi.number()
    .positive()
    .max(1000)
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Area planted must be greater than 0',
      'number.max': 'Area planted cannot exceed 1000 hectares',
      'any.required': 'Area planted is required'
    }),
  seedClassification: Joi.string()
    .valid(...SeedClassifications)
    .required()
    .messages({
      'any.only': 'Invalid seed classification',
      'any.required': 'Seed classification is required'
    }),
  cropInsurance: Joi.boolean().default(false)
};

const distributionMetadataFields = {
  distributionRequestId: Joi.string().trim().allow(null).optional(),
  distributionItemId: Joi.string().trim().allow(null).optional(),
  distributionQuantity: Joi.number().integer().positive().allow(null).optional(),
  distributionUnit: Joi.string().trim().max(50).allow(null).optional(),
  distributedQuantity: Joi.number().positive().precision(2).allow(null).optional(),
  distributionPickupDate: Joi.date().allow(null).optional()
};

// ==================== BASE SCHEMAS ====================
export const farmerInfoSchema = Joi.object(farmerInfoFields);
export const seedingDetailsSchema = Joi.object(seedingDetailsFields);
export const distributionMetadataSchema = Joi.object(distributionMetadataFields).optional();

// ==================== STATE TRANSITION SCHEMAS ====================
export const toPlantedSchema = Joi.object({
  dateOfPlanting: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Date of planting must be a valid date',
      'date.max': 'Date of planting cannot be in the future',
      'any.required': 'Date of planting is required to transition to Planted state'
    }),
  plantingMethod: Joi.string()
    .valid(...PlantingMethods)
    .required()
    .messages({
      'any.only': 'Planting method must be Transplanting or Direct_Seeded',
      'any.required': 'Planting method is required to transition to Planted state'
    }),
  riceIrrigation: Joi.string()
    .valid(...RiceIrrigationTypes)
    .allow(null)
    .when('typeOfCrop', {
      is: 'Rice',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .when('$typeOfCrop', {
      is: 'Rice',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.only': 'Rice irrigation must be Irrigated or RainfedLowland',
      'any.required': 'Rice irrigation type is required for Rice crops'
    }),
  typeOfCrop: Joi.string().valid(...CropTypes).optional(),
  areaPlanted: Joi.number().positive().max(1000).precision(2).optional(),
  transitionNote: Joi.string().max(500).allow('').optional()
});

export const toCompletedSchema = Joi.object({
  harvestArea: Joi.number()
    .positive()
    .max(Joi.ref('$areaPlanted'))
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Harvest area must be greater than 0',
      'number.max': 'Harvest area cannot exceed planted area',
      'any.required': 'Harvest area is required to transition to Completed state'
    }),
  numberOfBags: Joi.number()
    .integer()
    .positive()
    .max(100000)
    .required()
    .messages({
      'number.positive': 'Number of bags must be greater than 0',
      'number.integer': 'Number of bags must be a whole number',
      'number.max': 'Number of bags seems unreasonably high (max 100,000)',
      'any.required': 'Number of bags is required to transition to Completed state'
    }),
  weightPerBag: Joi.number()
    .positive()
    .min(5)
    .max(100)
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Weight per bag must be greater than 0',
      'number.min': 'Weight per bag is too low (minimum 5 kg)',
      'number.max': 'Weight per bag is too high (maximum 100 kg)',
      'any.required': 'Weight per bag is required to transition to Completed state'
    }),
  transitionNote: Joi.string().max(500).allow('').optional()
});

export const archiveReportSchema = Joi.object({
  archiveNote: Joi.string().max(500).allow('').optional()
});

export const unarchiveReportSchema = Joi.object({
  unarchiveNote: Joi.string().max(500).allow('').optional()
});

export const softDeleteSchema = Joi.object({
  deleteNote: Joi.string().max(500).allow('').optional()
});

export const restoreReportSchema = Joi.object({
  restoreNote: Joi.string().max(500).allow('').optional()
});

// ==================== CRUD SCHEMAS ====================
export const createReportSchema = Joi.object({
  ...farmerInfoFields,
  ...seedingDetailsFields,
  ...distributionMetadataFields,
  requestNote: Joi.string().max(1000).allow('').optional()
});

export const updateReportSchema = Joi.object({
  farmerName: Joi.string().trim().min(2).max(100).optional(),
  farmLocation: Joi.string().trim().min(2).max(200).optional(),
  rsbsaNumber: Joi.string().trim().pattern(/^[A-Za-z0-9-]+$/).allow(null, '').optional(),
  typeOfCrop: Joi.string().valid(...CropTypes).optional(),
  varietyId: Joi.string().trim().optional(),
  croppingSeasonId: Joi.string().trim().allow(null).optional(),
  areaPlanted: Joi.number().positive().max(1000).precision(2).optional(),
  seedClassification: Joi.string().valid(...SeedClassifications).optional(),
  cropInsurance: Joi.boolean().optional(),
  dateOfPlanting: Joi.date().max('now').optional(),
  plantingMethod: Joi.string().valid(...PlantingMethods).optional(),
  riceIrrigation: Joi.string().valid(...RiceIrrigationTypes).allow(null).optional(),
  harvestArea: Joi.number().positive().max(1000).precision(2).optional(),
  numberOfBags: Joi.number().integer().positive().optional(),
  weightPerBag: Joi.number().positive().min(5).max(100).precision(2).optional(),
  yieldMtPerHa: Joi.number().positive().precision(2).optional(),
  dateOfExpectedHarvest: Joi.date().optional(),
  requestNote: Joi.string().max(1000).allow('').optional(),
  isArchived: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
  state: Joi.string().valid(...PlantingReportStates).optional()
});

// ==================== BULK OPERATION SCHEMAS ====================
export const bulkArchiveSchema = Joi.object({
  reportIds: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one report ID required',
      'array.max': 'Cannot archive more than 100 reports at once'
    }),
  archiveNote: Joi.string().max(500).allow('').optional()
});

export const bulkDeleteSchema = Joi.object({
  reportIds: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one report ID required',
      'array.max': 'Cannot delete more than 100 reports at once'
    }),
  deleteNote: Joi.string().max(500).allow('').optional()
});

// ==================== HELPER VALIDATORS ====================
export function validateYieldSanity(cropType, yieldMtPerHa) {
  const yieldValue = Number(yieldMtPerHa);
  if (Number.isNaN(yieldValue)) {
    return { valid: false, warning: 'Yield value is not a number' };
  }

  if (cropType === 'Rice') {
    if (yieldValue < 1 || yieldValue > 12) {
      return {
        valid: false,
        warning: `Rice yield (${yieldValue} Mt/Ha) is outside acceptable range (1-12 Mt/Ha). Please verify harvest data.`
      };
    }
    if (yieldValue < 3 || yieldValue > 8) {
      return {
        valid: true,
        warning: `Rice yield (${yieldValue} Mt/Ha) is unusual. Typical range is 3-8 Mt/Ha. Please verify if correct.`
      };
    }
  } else if (cropType === 'Corn') {
    if (yieldValue < 1 || yieldValue > 15) {
      return {
        valid: false,
        warning: `Corn yield (${yieldValue} Mt/Ha) is outside acceptable range (1-15 Mt/Ha). Please verify harvest data.`
      };
    }
    if (yieldValue < 4 || yieldValue > 10) {
      return {
        valid: true,
        warning: `Corn yield (${yieldValue} Mt/Ha) is unusual. Typical range is 4-10 Mt/Ha. Please verify if correct.`
      };
    }
  }

  return { valid: true, warning: null };
}

export function validateHarvestArea(areaPlanted, harvestArea) {
  if (harvestArea > areaPlanted) {
    return {
      valid: false,
      error: `Harvest area (${harvestArea} ha) cannot exceed planted area (${areaPlanted} ha)`
    };
  }

  if (harvestArea < areaPlanted * 0.5) {
    return {
      valid: true,
      warning: `Harvest area (${harvestArea} ha) is less than 50% of planted area (${areaPlanted} ha). This seems low.`
    };
  }

  return { valid: true, warning: null };
}

export function validateStateTransition(currentState, newState) {
  const validTransitions = {
    Request_Report: ['Planted'],
    Planted: ['Completed'],
    Completed: []
  };

  if (!validTransitions[currentState]) {
    return {
      valid: false,
      error: `Invalid current state: ${currentState}`
    };
  }

  if (!validTransitions[currentState].includes(newState)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentState} to ${newState}. Allowed: ${validTransitions[currentState].join(', ') || 'none'}`
    };
  }

  return { valid: true, error: null };
}

// ==================== EXPORTS ====================
export default {
  farmerInfoSchema,
  seedingDetailsSchema,
  distributionMetadataSchema,
  toPlantedSchema,
  toCompletedSchema,
  archiveReportSchema,
  unarchiveReportSchema,
  softDeleteSchema,
  restoreReportSchema,
  createReportSchema,
  updateReportSchema,
  bulkArchiveSchema,
  bulkDeleteSchema,
  validateYieldSanity,
  validateHarvestArea,
  validateStateTransition
};
