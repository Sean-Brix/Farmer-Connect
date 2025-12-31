/**
 * @typedef {'Request_Report' | 'Planted' | 'Completed'} PlantingReportState
 */

/**
 * @typedef {'Rice' | 'Corn' | 'High-Value'} CropType
 */

/**
 * @typedef {'Direct Seeding' | 'Transplanting'} PlantingMethod
 */

/**
 * @typedef {'Irrigated' | 'Rainfed' | 'Upland'} RiceIrrigationType
 */

/**
 * @typedef {'Certified' | 'Good' | 'Registered' | 'Foundation' | 'Breeder'} SeedClassification
 */

/**
 * @typedef {Object} PlantingReport
 * @property {number} id
 * @property {string} farmerName
 * @property {string} farmLocation
 * @property {string|null} rsbsaNumber
 * @property {CropType} typeOfCrop
 * @property {number} varietyId
 * @property {Object} variety
 * @property {string} variety.name
 * @property {number|null} croppingSeasonId
 * @property {Object|null} croppingSeason
 * @property {string|null} croppingSeason.season
 * @property {number} croppingSeason.year
 * @property {number} areaPlanted
 * @property {SeedClassification} seedClassification
 * @property {string|null} cropInsurance
 * @property {PlantingReportState} state
 * @property {string|null} dateOfPlanting
 * @property {PlantingMethod|null} plantingMethod
 * @property {RiceIrrigationType|null} riceIrrigation
 * @property {string|null} dateOfExpectedHarvest
 * @property {number|null} harvestArea
 * @property {number|null} numberOfBags
 * @property {number|null} weightPerBag
 * @property {number|null} yieldMtPerHa
 * @property {boolean} isArchived
 * @property {boolean} isDeleted
 * @property {string|null} deletedAt
 * @property {number|null} distributionRequestId
 * @property {Object|null} distributionRequest
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page
 * @property {number} limit
 * @property {PlantingReportState|null} state
 * @property {boolean|null} isArchived
 * @property {boolean|null} distributionLinked
 * @property {string|null} search
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {PlantingReport[]} data
 * @property {Object} pagination
 * @property {number} pagination.currentPage
 * @property {number} pagination.totalPages
 * @property {number} pagination.totalItems
 * @property {number} pagination.pageSize
 * @property {boolean} pagination.hasNextPage
 * @property {boolean} pagination.hasPreviousPage
 * @property {number} pagination.startItem
 * @property {number} pagination.endItem
 */

/**
 * @typedef {Object} Statistics
 * @property {number} total
 * @property {number} request
 * @property {number} planted
 * @property {number} completed
 * @property {number} archived
 * @property {number} deleted
 * @property {number} distributionLinked
 * @property {number} totalAreaPlanted
 * @property {number} totalYield
 */

export {};
