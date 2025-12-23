# PlantingReport Feature - Validation Rules

**Part of:** [Analysis_Overview.md](./Analysis_Overview.md)  
**Last Updated:** December 24, 2025

---

## Validation Strategy

### Three-Layer Validation

1. **Frontend (Immediate Feedback)** - React Hook Form + Joi/Zod
2. **Backend (Security)** - Joi schemas before database operations
3. **Database (Integrity)** - Constraints and triggers

---

## State Transition Validation

### State 1 (Request_Report) → State 2 (Planted)

#### Required Fields

| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| `dateOfPlanting` | Date | ≤ today, > 1900-01-01 | "Planting date cannot be in the future" |
| `plantingMethod` | Enum | 'Transplanted' \| 'Direct_Seeded' | "Please select a planting method" |
| `areaPlanted` | Float | > 0, ≤ 1000 | "Planted area must be between 0 and 1000 hectares" |
| `riceIrrigation` | Enum (if Rice) | 'Irrigated' \| 'Rainfed' | "Rice irrigation type is required" |

#### Frontend Validation (Joi Schema)

```javascript
// validation/stateTransitionRules.js
import Joi from 'joi';

export const toPlantedSchema = Joi.object({
  dateOfPlanting: Joi.date()
    .max('now')
    .min('1900-01-01')
    .required()
    .messages({
      'date.max': 'Planting date cannot be in the future',
      'date.min': 'Please enter a valid planting date',
      'any.required': 'Planting date is required'
    }),

  plantingMethod: Joi.string()
    .valid('Transplanted', 'Direct_Seeded')
    .required()
    .messages({
      'any.only': 'Planting method must be Transplanted or Direct Seeded',
      'any.required': 'Planting method is required'
    }),

  areaPlanted: Joi.number()
    .positive()
    .max(1000)
    .required()
    .messages({
      'number.positive': 'Planted area must be greater than 0',
      'number.max': 'Planted area cannot exceed 1000 hectares',
      'any.required': 'Planted area is required'
    }),

  typeOfCrop: Joi.string()
    .valid('Rice', 'Corn', 'HighValue')
    .required(),

  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: Joi.string()
      .valid('Irrigated', 'Rainfed')
      .required()
      .messages({
        'any.required': 'Rice irrigation type is required for rice crops',
        'any.only': 'Rice irrigation must be Irrigated or Rainfed'
      }),
    otherwise: Joi.optional()
  })
});
```

#### Backend Validation

```javascript
// Controller/PlantingReport/plantingReportController.js
import { toPlantedSchema } from '../validation/stateTransitionRules.js';

export async function transitionToPlanted(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  // Find current report
  const report = await prisma.plantingReport.findUnique({ where: { id } });

  // Check current state
  if (report.state !== 'Request_Report') {
    return res.status(400).json({
      error: 'Invalid state transition',
      message: 'Report must be in Request_Report state to transition to Planted'
    });
  }

  // Validate transition data
  const { error, value } = toPlantedSchema.validate(
    { ...report, ...updateData },
    { abortEarly: false }
  );

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  // Calculate expected harvest if Rice
  let expectedHarvest = null;
  if (report.typeOfCrop === 'Rice' && value.dateOfPlanting && report.variety) {
    const plantDate = new Date(value.dateOfPlanting);
    expectedHarvest = new Date(
      plantDate.setDate(plantDate.getDate() + report.variety.daysToMaturityDry)
    );
  }

  // Update with state transition
  const updated = await prisma.plantingReport.update({
    where: { id },
    data: {
      dateOfPlanting: value.dateOfPlanting,
      plantingMethod: value.plantingMethod,
      riceIrrigation: value.riceIrrigation,
      dateOfExpectedHarvest: expectedHarvest,
      state: 'Planted',
      stateHistory: [
        ...(report.stateHistory || []),
        {
          from: 'Request_Report',
          to: 'Planted',
          timestamp: new Date(),
          userId: req.user.userId,
          data: {
            dateOfPlanting: value.dateOfPlanting,
            plantingMethod: value.plantingMethod
          }
        }
      ],
      lastUpdatedBy: req.user.userId
    }
  });

  return res.json(updated);
}
```

#### React Hook Form Integration

```javascript
// hooks/useReportForm.js
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { toPlantedSchema } from '../validation/stateTransitionRules';

export const useReportForm = (report) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: joiResolver(getSchemaForState(report?.state)),
    defaultValues: report || {},
    mode: 'onChange' // Real-time validation
  });

  const canTransitionToPlanted = () => {
    const data = watch();
    const { error } = toPlantedSchema.validate(data);
    return !error;
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    canTransitionToPlanted
  };
};
```

---

### State 2 (Planted) → State 3 (Completed)

#### Required Fields

| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| `harvestArea` | Float | > 0, ≤ areaPlanted | "Harvest area cannot exceed planted area ({areaPlanted} ha)" |
| `numberOfBags` | Integer | > 0, ≤ 10000 | "Number of bags must be between 1 and 10,000" |
| `weightPerBag` | Float | > 0, ≤ 100 | "Weight per bag must be between 0 and 100 kg" |

#### Auto-Calculated Field

| Field | Formula | Validation |
|-------|---------|------------|
| `yieldMtPerHa` | `(harvestArea × numberOfBags × weightPerBag) / 1000` | Must be > 0 |

#### Frontend Validation (Joi Schema)

```javascript
export const toCompletedSchema = Joi.object({
  harvestArea: Joi.number()
    .positive()
    .max(Joi.ref('areaPlanted'))
    .required()
    .messages({
      'number.positive': 'Harvest area must be greater than 0',
      'number.max': 'Harvest area cannot exceed planted area ({{#limit}} ha)',
      'any.required': 'Harvest area is required'
    }),

  numberOfBags: Joi.number()
    .integer()
    .positive()
    .max(10000)
    .required()
    .messages({
      'number.integer': 'Number of bags must be a whole number',
      'number.positive': 'Number of bags must be greater than 0',
      'number.max': 'Number of bags cannot exceed 10,000',
      'any.required': 'Number of bags is required'
    }),

  weightPerBag: Joi.number()
    .positive()
    .max(100)
    .required()
    .messages({
      'number.positive': 'Weight per bag must be greater than 0',
      'number.max': 'Weight per bag cannot exceed 100 kg',
      'any.required': 'Weight per bag is required'
    }),

  areaPlanted: Joi.number().positive().required() // For validation reference
});
```

#### Backend Validation with Auto-Calculation

```javascript
export async function transitionToCompleted(req, res) {
  const { id } = req.params;
  const { harvestArea, numberOfBags, weightPerBag } = req.body;

  const report = await prisma.plantingReport.findUnique({ where: { id } });

  // Check current state
  if (report.state !== 'Planted') {
    return res.status(400).json({
      error: 'Invalid state transition',
      message: 'Report must be in Planted state to transition to Completed'
    });
  }

  // Validate transition data
  const { error, value } = toCompletedSchema.validate({
    harvestArea,
    numberOfBags,
    weightPerBag,
    areaPlanted: report.areaPlanted // For reference validation
  });

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  // Auto-calculate yield
  const yieldMtPerHa = (value.harvestArea * value.numberOfBags * value.weightPerBag) / 1000;

  // Additional business rule: Yield sanity check
  if (yieldMtPerHa > 20) {
    return res.status(400).json({
      error: 'Yield validation failed',
      message: `Calculated yield (${yieldMtPerHa.toFixed(2)} Mt/Ha) seems unusually high. Please verify harvest data.`,
      calculatedYield: yieldMtPerHa
    });
  }

  // Update with state transition
  const updated = await prisma.plantingReport.update({
    where: { id },
    data: {
      harvestArea: value.harvestArea,
      numberOfBags: value.numberOfBags,
      weightPerBag: value.weightPerBag,
      yieldMtPerHa,
      state: 'Completed',
      stateHistory: [
        ...(report.stateHistory || []),
        {
          from: 'Planted',
          to: 'Completed',
          timestamp: new Date(),
          userId: req.user.userId,
          data: {
            harvestArea: value.harvestArea,
            numberOfBags: value.numberOfBags,
            weightPerBag: value.weightPerBag,
            yieldMtPerHa
          }
        }
      ],
      lastUpdatedBy: req.user.userId
    }
  });

  return res.json(updated);
}
```

---

### State 3 (Completed) → Archive

#### Requirements

| Requirement | Validation | Error Message |
|-------------|------------|---------------|
| Current state | Must be 'Completed' | "Only completed reports can be archived" |
| User role | Admin or Superadmin | "Insufficient permissions to archive reports" |
| Not already archived | `isArchived === false` | "Report is already archived" |

#### Backend Validation

```javascript
export async function archiveReport(req, res) {
  const { id } = req.params;

  const report = await prisma.plantingReport.findUnique({
    where: { id },
    include: { variety: true, season: true }
  });

  // Validate state
  if (report.state !== 'Completed') {
    return res.status(400).json({
      error: 'Cannot archive report',
      message: 'Only completed reports can be archived',
      currentState: report.state
    });
  }

  // Validate not already archived
  if (report.isArchived) {
    return res.status(400).json({
      error: 'Already archived',
      message: 'This report is already archived'
    });
  }

  // Validate user role
  if (!['Admin', 'Superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'Only admins can archive reports'
    });
  }

  // Update report
  const updated = await prisma.plantingReport.update({
    where: { id },
    data: {
      isArchived: true,
      archivedAt: new Date(),
      archivedBy: req.user.userId,
      lastUpdatedBy: req.user.userId
    }
  });

  // Update linked distribution if exists
  if (report.distributionRequestId) {
    await prisma.distributionRequest.update({
      where: { id: report.distributionRequestId },
      data: {
        plantingReportStatus: 'Archived',
        lastUpdatedBy: req.user.userId
      }
    });
  }

  return res.json(updated);
}
```

---

## Field-Level Validation Rules

### Farmer Information

```javascript
const farmerInfoSchema = Joi.object({
  farmerName: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s.,-]+$/)
    .required()
    .messages({
      'string.min': 'Farmer name must be at least 2 characters',
      'string.max': 'Farmer name cannot exceed 100 characters',
      'string.pattern.base': 'Farmer name contains invalid characters',
      'any.required': 'Farmer name is required'
    }),

  location: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Location must be at least 2 characters',
      'string.max': 'Location cannot exceed 200 characters',
      'any.required': 'Location is required'
    }),

  rsbsa: Joi.string()
    .pattern(/^[A-Z0-9-]+$/)
    .max(50)
    .optional()
    .messages({
      'string.pattern.base': 'RSBSA must contain only uppercase letters, numbers, and hyphens',
      'string.max': 'RSBSA cannot exceed 50 characters'
    })
});
```

### Seeding Details

```javascript
const seedingDetailsSchema = Joi.object({
  typeOfCrop: Joi.string()
    .valid('Rice', 'Corn', 'HighValue')
    .required()
    .messages({
      'any.only': 'Crop type must be Rice, Corn, or High Value',
      'any.required': 'Crop type is required'
    }),

  varietyId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid variety ID format',
      'any.required': 'Variety is required'
    }),

  seasonId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid season ID format',
      'any.required': 'Season is required'
    }),

  areaPlanted: Joi.number()
    .positive()
    .max(1000)
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Planted area must be greater than 0',
      'number.max': 'Planted area cannot exceed 1000 hectares',
      'number.precision': 'Planted area can have at most 2 decimal places',
      'any.required': 'Planted area is required'
    })
});
```

---

## Cross-Field Validation

### Harvest Area vs Planted Area

```javascript
const harvestAreaValidation = Joi.object({
  harvestArea: Joi.number()
    .positive()
    .max(Joi.ref('areaPlanted'))
    .required()
    .messages({
      'number.max': 'Harvest area ({#value} ha) cannot exceed planted area ({{#limit}} ha)'
    }),
  
  areaPlanted: Joi.number().required()
});

// Frontend real-time validation
const validateHarvestArea = (harvestArea, areaPlanted) => {
  if (harvestArea > areaPlanted) {
    return {
      valid: false,
      message: `Harvest area (${harvestArea} ha) cannot exceed planted area (${areaPlanted} ha)`
    };
  }
  
  if (harvestArea < areaPlanted * 0.3) {
    return {
      valid: true,
      warning: `Harvest area (${harvestArea} ha) is significantly less than planted area (${areaPlanted} ha). Is this correct?`
    };
  }
  
  return { valid: true };
};
```

### Date Validations

```javascript
const dateValidations = Joi.object({
  dateOfPlanting: Joi.date()
    .max('now')
    .min('1900-01-01')
    .when('seasonId', {
      is: Joi.exist(),
      then: Joi.date().custom((value, helpers) => {
        const season = getSeason(helpers.state.ancestors[0].seasonId);
        if (!season) return value;
        
        const plantDate = new Date(value);
        const seasonStart = new Date(season.startDate);
        const seasonEnd = new Date(season.endDate);
        
        if (plantDate < seasonStart || plantDate > seasonEnd) {
          return helpers.error('date.outsideSeason', {
            seasonStart: seasonStart.toLocaleDateString(),
            seasonEnd: seasonEnd.toLocaleDateString()
          });
        }
        
        return value;
      }).messages({
        'date.outsideSeason': 'Planting date must be within selected season ({#seasonStart} - {#seasonEnd})'
      })
    })
});
```

### Yield Sanity Checks

```javascript
const yieldSanityCheck = (harvestArea, numberOfBags, weightPerBag, cropType) => {
  const yieldMtPerHa = (harvestArea * numberOfBags * weightPerBag) / 1000;
  
  const thresholds = {
    Rice: { min: 1, max: 12, typical: [3, 8] },
    Corn: { min: 1, max: 15, typical: [4, 10] },
    HighValue: { min: 0.5, max: 50, typical: null }
  };
  
  const threshold = thresholds[cropType];
  
  if (yieldMtPerHa < threshold.min) {
    return {
      valid: false,
      error: `Yield (${yieldMtPerHa.toFixed(2)} Mt/Ha) is unusually low for ${cropType}. Minimum expected: ${threshold.min} Mt/Ha`
    };
  }
  
  if (yieldMtPerHa > threshold.max) {
    return {
      valid: false,
      error: `Yield (${yieldMtPerHa.toFixed(2)} Mt/Ha) is unusually high for ${cropType}. Maximum expected: ${threshold.max} Mt/Ha`
    };
  }
  
  if (threshold.typical && (yieldMtPerHa < threshold.typical[0] || yieldMtPerHa > threshold.typical[1])) {
    return {
      valid: true,
      warning: `Yield (${yieldMtPerHa.toFixed(2)} Mt/Ha) is outside typical range for ${cropType} (${threshold.typical[0]}-${threshold.typical[1]} Mt/Ha). Please verify.`
    };
  }
  
  return { valid: true };
};
```

---

## Database Constraints

### Check Constraints

```sql
-- Harvest area cannot exceed planted area
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_harvest_area_valid"
  CHECK ("harvestArea" IS NULL OR "harvestArea" <= "areaPlanted");

-- Positive values only
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_positive_values"
  CHECK (
    "areaPlanted" > 0 AND
    ("harvestArea" IS NULL OR "harvestArea" > 0) AND
    ("numberOfBags" IS NULL OR "numberOfBags" > 0) AND
    ("weightPerBag" IS NULL OR "weightPerBag" > 0) AND
    ("yieldMtPerHa" IS NULL OR "yieldMtPerHa" > 0)
  );

-- Deleted/Archived timestamps
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_deleted_has_timestamp"
  CHECK (
    ("isDeleted" = false AND "deletedAt" IS NULL AND "deletedBy" IS NULL) OR
    ("isDeleted" = true AND "deletedAt" IS NOT NULL AND "deletedBy" IS NOT NULL)
  );

ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_archived_has_timestamp"
  CHECK (
    ("isArchived" = false AND "archivedAt" IS NULL AND "archivedBy" IS NULL) OR
    ("isArchived" = true AND "archivedAt" IS NOT NULL AND "archivedBy" IS NOT NULL)
  );

-- State-based field requirements
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_state_field_requirements"
  CHECK (
    -- State 1: Request_Report (planting fields optional)
    ("state" = 'Request_Report') OR
    
    -- State 2: Planted (planting fields required, harvest optional)
    ("state" = 'Planted' AND "dateOfPlanting" IS NOT NULL AND "plantingMethod" IS NOT NULL) OR
    
    -- State 3: Completed (all fields required)
    ("state" = 'Completed' AND 
     "dateOfPlanting" IS NOT NULL AND 
     "plantingMethod" IS NOT NULL AND
     "harvestArea" IS NOT NULL AND
     "numberOfBags" IS NOT NULL AND
     "weightPerBag" IS NOT NULL AND
     "yieldMtPerHa" IS NOT NULL)
  );
```

---

## Frontend Validation Helpers

### Real-Time Validation Hook

```javascript
// hooks/useRealtimeValidation.js
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export const useRealtimeValidation = (schema, value, delay = 300) => {
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  useEffect(() => {
    const validate = debounce(() => {
      const { error } = schema.validate(value, { abortEarly: false });
      
      if (error) {
        const newErrors = {};
        error.details.forEach(detail => {
          newErrors[detail.path.join('.')] = detail.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({});
      }
      
      // Business rule warnings
      const newWarnings = {};
      
      if (value.harvestArea && value.areaPlanted) {
        const ratio = value.harvestArea / value.areaPlanted;
        if (ratio < 0.3) {
          newWarnings.harvestArea = 'Harvest area is significantly less than planted area';
        }
      }
      
      setWarnings(newWarnings);
    }, delay);

    validate();

    return () => validate.cancel();
  }, [value, schema, delay]);

  return { errors, warnings };
};
```

### Validation Summary Component

```jsx
const ValidationSummary = ({ errors, warnings }) => {
  const errorCount = Object.keys(errors).length;
  const warningCount = Object.keys(warnings).length;

  if (errorCount === 0 && warningCount === 0) {
    return (
      <Alert severity="success">
        All fields are valid. Ready to save.
      </Alert>
    );
  }

  return (
    <Box>
      {errorCount > 0 && (
        <Alert severity="error" sx={{ mb: 1 }}>
          <AlertTitle>{errorCount} Validation Error(s)</AlertTitle>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}><strong>{field}:</strong> {message}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      {warningCount > 0 && (
        <Alert severity="warning">
          <AlertTitle>{warningCount} Warning(s)</AlertTitle>
          <ul>
            {Object.entries(warnings).map(([field, message]) => (
              <li key={field}><strong>{field}:</strong> {message}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Box>
  );
};
```

---

## Error Messages

### User-Friendly Error Messages

```javascript
const ERROR_MESSAGES = {
  // Generic
  REQUIRED: (field) => `${field} is required`,
  INVALID_FORMAT: (field) => `${field} has an invalid format`,
  
  // State Transitions
  INVALID_STATE_TRANSITION: (from, to) => 
    `Cannot transition from ${from} to ${to}. Please complete required fields.`,
  
  // Field-Specific
  PLANTING_DATE_FUTURE: 'Planting date cannot be in the future',
  PLANTING_DATE_TOO_OLD: 'Planting date seems too old. Please verify.',
  HARVEST_EXCEEDS_PLANTED: (harvest, planted) => 
    `Harvest area (${harvest} ha) cannot exceed planted area (${planted} ha)`,
  YIELD_TOO_HIGH: (yield, max) => 
    `Calculated yield (${yield} Mt/Ha) exceeds maximum expected (${max} Mt/Ha)`,
  YIELD_TOO_LOW: (yield, min) => 
    `Calculated yield (${yield} Mt/Ha) is below minimum expected (${min} Mt/Ha)`,
  
  // Permissions
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
  ADMIN_ONLY: 'This action can only be performed by administrators',
  
  // Archive/Delete
  ALREADY_ARCHIVED: 'This report is already archived',
  CANNOT_EDIT_ARCHIVED: 'Cannot edit archived reports. Unarchive first.',
  RESTORATION_EXPIRED: (days) => `Restoration period expired (${days} days ago)`,
  
  // Distribution
  DISTRIBUTION_NOT_FOUND: 'Linked distribution request not found',
  DISTRIBUTION_ALREADY_LINKED: 'This distribution is already linked to a planting report'
};
```

---

## Summary

### Validation Coverage

| Area | Frontend | Backend | Database |
|------|----------|---------|----------|
| **State Transitions** | ✅ Joi schemas | ✅ Joi validation | ✅ Check constraints |
| **Field Requirements** | ✅ React Hook Form | ✅ Request validation | ✅ NOT NULL constraints |
| **Cross-Field Rules** | ✅ Custom validators | ✅ Business logic | ✅ Check constraints |
| **Data Integrity** | ❌ N/A | ✅ Transaction logic | ✅ Foreign keys, indexes |
| **User Permissions** | ✅ UI disabling | ✅ Role checks | ❌ N/A |

### Validation Timing

- **On Input:** Real-time validation with debounce (300ms)
- **On Blur:** Field-level validation
- **On Submit:** Full form validation
- **On State Transition:** Complete state transition validation
- **On Save:** Backend validation + database constraints

**Next:** [Analysis_ImplementationPlan.md](./Analysis_ImplementationPlan.md)
